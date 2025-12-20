import {
    format,
    subDays,
    isSameDay,
    differenceInDays,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    startOfYear,
    endOfYear,
    getDay,
    startOfMonth
} from 'date-fns';

export const calculatePremiumStats = (habits) => {
    const today = new Date();
    const activeHabitsCount = habits.length;

    // 1. Map all dates with at least one completion
    // Format: "yyyy-MM-dd" -> count
    const dailyCompletionsMap = {};

    habits.forEach(habit => {
        if (!habit.completions) return;
        habit.completions.forEach(c => {
            if (c.completed) {
                const dateStr = typeof c.date === 'string' ? c.date : format(new Date(c.date), 'yyyy-MM-dd');
                dailyCompletionsMap[dateStr] = (dailyCompletionsMap[dateStr] || 0) + 1;
            }
        });
    });

    const completionDates = Object.keys(dailyCompletionsMap).sort();

    // 2. Global Current Streak
    // Count consecutive days going backwards from today (or yesterday) that have > 0 completions
    let currentStreak = 0;
    let checkDate = today;
    let checkDateStr = format(checkDate, 'yyyy-MM-dd');

    // If today has completions, start counting from today. Else check yesterday.
    if (!dailyCompletionsMap[checkDateStr]) {
        checkDate = subDays(today, 1);
        checkDateStr = format(checkDate, 'yyyy-MM-dd');
    }

    while (dailyCompletionsMap[checkDateStr] > 0) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
        checkDateStr = format(checkDate, 'yyyy-MM-dd');
    }

    // 3. Best Global Streak
    // Iterate through all completion dates to find max consecutive info
    let maxStreak = 0;
    let tempStreak = 0;
    if (completionDates.length > 0) {
        // Basic algo: sort dates, iterate, check if diff is 1 day
        // Must convert strings to timestamps for robust diff
        const sortedTimestamps = completionDates.map(d => new Date(d).getTime()).sort((a, b) => a - b);

        tempStreak = 1;
        maxStreak = 1;

        for (let i = 1; i < sortedTimestamps.length; i++) {
            const prev = sortedTimestamps[i - 1];
            const curr = sortedTimestamps[i];
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempStreak++;
            } else {
                maxStreak = Math.max(maxStreak, tempStreak);
                tempStreak = 1;
            }
        }
        maxStreak = Math.max(maxStreak, tempStreak);
    }

    // 4. Overall Completion % (Month to Date)
    // User Request: "should be 100 if he did all task till current date"
    // We calculate based on Start of Current Month -> Today
    const startOfCurrentMonth = startOfMonth(today);
    const daysElapsedInMonth = differenceInDays(today, startOfCurrentMonth) + 1;

    let possibleCompletionsMTD = habits.length * daysElapsedInMonth;
    let actualCompletionsMTD = 0;

    // Calculate Month-To-Date completions
    const currentMonthStr = format(today, 'yyyy-MM');
    // Using our map is faster? Iterate days from startOfMonth to today
    for (let i = 0; i < daysElapsedInMonth; i++) {
        const d = subDays(today, i);
        // Only count if within current month (subDays goes back, so start from today backwards is safe as long as we stop at start of month)
        // Actually simplest is:
        const checkDate = subDays(today, i);
        if (checkDate < startOfCurrentMonth) break;

        const dStr = format(checkDate, 'yyyy-MM-dd');
        actualCompletionsMTD += (dailyCompletionsMap[dStr] || 0);
    }

    const overallCompletionRate = possibleCompletionsMTD > 0
        ? Math.round((actualCompletionsMTD / possibleCompletionsMTD) * 100)
        : 0;

    // Maintain Last 30 Days for Velocity/Health metrics
    // To avoid calculating "since the beginning of time", let's measure against "Last 30 Days" efficiency for the % ring
    // It feels more relevant.
    const daysWindow = 30;
    // let possibleCompletionsLast30 = habits.length * daysWindow; // Unused for Rate now
    let actualCompletionsLast30 = 0;

    for (let i = 0; i < daysWindow; i++) {
        const d = subDays(today, i);
        const dStr = format(d, 'yyyy-MM-dd');
        actualCompletionsLast30 += (dailyCompletionsMap[dStr] || 0);
    }



    // 5. Recovery Rate
    // Find gaps > 1 day. Average the gap size? 
    // User definition: "How often user resumes after missing a day" -> "You usually resume within X days"
    // Scan sorted dates. If diff > 1, record gap. 
    const gaps = [];
    if (completionDates.length > 0) {
        const sortedTimestamps = completionDates.map(d => new Date(d).getTime()).sort((a, b) => a - b);
        for (let i = 1; i < sortedTimestamps.length; i++) {
            const prev = sortedTimestamps[i - 1];
            const curr = sortedTimestamps[i];
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) {
                // Gap is diffDays - 1. E.g. Mon(1) to Wed(3) is diff 2. Gap is Tue(1 day).
                gaps.push(diffDays - 1);
            }
        }
    }
    const avgGap = gaps.length > 0 ? (gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(1) : "0";
    const recoveryMessage = gaps.length === 0
        ? "Unstoppable streak!"
        : `${avgGap} day${avgGap === "1.0" ? '' : 's'}`;


    // 6. Best/Worst Day
    const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
    Object.keys(dailyCompletionsMap).forEach(d => {
        const dayIdx = getDay(new Date(d));
        dayCounts[dayIdx] += dailyCompletionsMap[d];
    });
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const maxVal = Math.max(...dayCounts);
    const minVal = Math.min(...dayCounts.filter(v => v > 0)); // Filter 0 to ignore unused days if any

    const bestDay = days[dayCounts.indexOf(maxVal)] || "Today";
    const worstDay = days[dayCounts.indexOf(minVal)] || "None";


    // 7. Weekend vs Weekday Performance
    let weekendCompletions = 0;
    let weekdayCompletions = 0;
    let weekendPossible = 0;
    let weekdayPossible = 0;

    for (let i = 0; i < 30; i++) {
        const d = subDays(today, i);
        const dayIdx = getDay(d);
        const isWeekend = dayIdx === 0 || dayIdx === 6;
        const dStr = format(d, 'yyyy-MM-dd');

        if (isWeekend) {
            weekendPossible += activeHabitsCount;
            weekendCompletions += (dailyCompletionsMap[dStr] || 0);
        } else {
            weekdayPossible += activeHabitsCount;
            weekdayCompletions += (dailyCompletionsMap[dStr] || 0);
        }
    }

    const weekendRate = weekendPossible > 0 ? Math.round((weekendCompletions / weekendPossible) * 100) : 0;
    const weekdayRate = weekdayPossible > 0 ? Math.round((weekdayCompletions / weekdayPossible) * 100) : 0;

    // 8. Consistency Score (0-100)
    // Weighted formula: 40% Completion Rate, 40% Current Streak (capped at 30 days), 20% Recovery Rate
    const streakWeight = Math.min(currentStreak / 30, 1) * 40;
    const rateWeight = (overallCompletionRate / 100) * 40;
    const recoveryWeight = (avgGap <= 1 ? 20 : avgGap <= 3 ? 10 : 0);
    const consistencyScore = Math.round(streakWeight + rateWeight + recoveryWeight);

    // 9. Habit Leaderboard
    const rankedHabits = habits.map(h => {
        const completions = h.completions?.filter(c => c.completed)?.length || 0;
        return { ...h, totalCompletions: completions };
    }).sort((a, b) => b.totalCompletions - a.totalCompletions);


    // 10. Heatmap Data (Last 365 days)
    const heatmapData = [];
    Object.entries(dailyCompletionsMap).forEach(([date, count]) => {
        const intensity = count >= activeHabitsCount ? 4 :
            count >= activeHabitsCount * 0.75 ? 3 :
                count >= activeHabitsCount * 0.5 ? 2 : 1;
        heatmapData.push({ date, count, intensity });
    });

    // 11. Weekly Momentum (Completions this week vs last week)
    const startOfCurrentWeek = startOfWeek(today);
    const endOfCurrentWeek = endOfWeek(today);
    const startOfLastWeek = startOfWeek(subDays(today, 7));
    const endOfLastWeek = endOfWeek(subDays(today, 7));

    let currentWeekCompletions = 0;
    let lastWeekCompletions = 0;

    Object.entries(dailyCompletionsMap).forEach(([dateStr, count]) => {
        const d = new Date(dateStr);
        if (d >= startOfCurrentWeek && d <= endOfCurrentWeek) {
            currentWeekCompletions += count;
        } else if (d >= startOfLastWeek && d <= endOfLastWeek) {
            lastWeekCompletions += count;
        }
    });

    let weeklyMomentum = 0;
    if (lastWeekCompletions > 0) {
        weeklyMomentum = Math.round(((currentWeekCompletions - lastWeekCompletions) / lastWeekCompletions) * 100);
    } else if (currentWeekCompletions > 0) {
        weeklyMomentum = 100; // From 0 to something is 100% gain for simplicity
    }

    return {
        overview: {
            completionRate: overallCompletionRate,
            currentStreak,
            bestStreak: maxStreak,
            activeHabits: activeHabitsCount,
            weeklyMomentum
        },
        trends: {
            bestDay,
            worstDay,
            totalCompletionsLast30: actualCompletionsLast30
        },
        insights: {
            recoveryMessage,
            longestGap: gaps.length > 0 ? Math.max(...gaps) : 0,
            averageCompletionsPerDay: (actualCompletionsLast30 / 30).toFixed(1),
            weekendRate,
            weekdayRate,
            consistencyScore
        },
        rankings: {
            top: rankedHabits[0],
            bottom: rankedHabits[rankedHabits.length - 1],
            all: rankedHabits
        },
        heatmap: heatmapData
    };
};
