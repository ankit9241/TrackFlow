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
    startOfMonth,
    endOfMonth
} from 'date-fns';

export const calculatePremiumStats = (habits, targetDate = new Date()) => {
    const today = new Date();
    const isCurrentMonth = format(targetDate, 'yyyy-MM') === format(today, 'yyyy-MM');
    const referenceDate = isCurrentMonth ? today : endOfMonth(targetDate);

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

    const referenceDateStr = format(referenceDate, 'yyyy-MM-dd');
    const isFutureMonth = startOfMonth(targetDate) > startOfMonth(today);

    const completionDates = Object.keys(dailyCompletionsMap)
        .filter(d => d <= referenceDateStr)
        .sort();

    // 2. Global Current Streak
    // If it's a future month, current streak is 0 relative to that time
    let currentStreak = 0;
    if (!isFutureMonth) {
        let checkDate = referenceDate;
        let checkDateStr = format(checkDate, 'yyyy-MM-dd');

        if (!dailyCompletionsMap[checkDateStr]) {
            checkDate = subDays(referenceDate, 1);
            checkDateStr = format(checkDate, 'yyyy-MM-dd');
        }

        while (dailyCompletionsMap[checkDateStr] > 0) {
            currentStreak++;
            checkDate = subDays(checkDate, 1);
            checkDateStr = format(checkDate, 'yyyy-MM-dd');
        }
    }

    // 3. Best Global Streak
    let maxStreak = 0;
    if (!isFutureMonth && completionDates.length > 0) {
        const sortedTimestamps = completionDates.map(d => new Date(d).getTime()).sort((a, b) => a - b);
        let tempStreak = 1;
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

    // 4. Overall Completion % (Month to Date / Selected Month)
    const startOfSelectedMonth = startOfMonth(targetDate);
    const daysElapsedInContext = isFutureMonth ? 0 : (differenceInDays(referenceDate, startOfSelectedMonth) + 1);

    let actualCompletionsMTD = 0;
    if (!isFutureMonth) {
        for (let i = 0; i < daysElapsedInContext; i++) {
            const d = subDays(referenceDate, i);
            if (d < startOfSelectedMonth) break;
            const dStr = format(d, 'yyyy-MM-dd');
            actualCompletionsMTD += (dailyCompletionsMap[dStr] || 0);
        }
    }

    const activeHabitsInMonth = habits.filter(h => {
        const hStart = h.startDate ? new Date(h.startDate) : null;
        const hEnd = h.endDate ? new Date(h.endDate) : null;
        const monthEnd = endOfMonth(targetDate);
        return (!hStart || hStart <= monthEnd) && (!hEnd || hEnd >= startOfSelectedMonth);
    });

    let possibleCompletionsMTD = activeHabitsInMonth.length * daysElapsedInContext;
    const overallCompletionRate = possibleCompletionsMTD > 0
        ? Math.round((actualCompletionsMTD / possibleCompletionsMTD) * 100)
        : 0;

    // 5. Recovery Rate
    const gaps = [];
    if (!isFutureMonth && completionDates.length > 0) {
        const sortedTimestamps = completionDates.map(d => new Date(d).getTime()).sort((a, b) => a - b);
        for (let i = 1; i < sortedTimestamps.length; i++) {
            const prev = sortedTimestamps[i - 1];
            const curr = sortedTimestamps[i];
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
            if (diffDays > 1) gaps.push(diffDays - 1);
        }
    }
    const avgGap = gaps.length > 0 ? (gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(1) : "0";
    const recoveryMessage = isFutureMonth ? "Awaiting data..." : (gaps.length === 0 ? "Unstoppable streak!" : `${avgGap} day${avgGap === "1.0" ? '' : 's'}`);

    // 6. Best/Worst Day
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const startOfWindow = subDays(referenceDate, 30);
    if (!isFutureMonth) {
        Object.keys(dailyCompletionsMap).forEach(d => {
            if (d >= format(startOfWindow, 'yyyy-MM-dd') && d <= referenceDateStr) {
                const dayIdx = getDay(new Date(d));
                dayCounts[dayIdx] += dailyCompletionsMap[d];
            }
        });
    }
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const validDayCounts = dayCounts.filter(v => v > 0);
    const maxVal = Math.max(...dayCounts);
    const minVal = validDayCounts.length > 0 ? Math.min(...validDayCounts) : 0;

    const bestDay = maxVal > 0 ? days[dayCounts.indexOf(maxVal)] : "None";
    const worstDay = (minVal > 0 && minVal < maxVal) ? days[dayCounts.indexOf(minVal)] : "None";

    // 7. Weekend vs Weekday Performance
    let weekendCompletions = 0;
    let weekdayCompletions = 0;
    let weekendPossible = 0;
    let weekdayPossible = 0;

    if (!isFutureMonth) {
        for (let i = 0; i < 30; i++) {
            const d = subDays(referenceDate, i);
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
    }

    const weekendRate = weekendPossible > 0 ? Math.round((weekendCompletions / weekendPossible) * 100) : 0;
    const weekdayRate = weekdayPossible > 0 ? Math.round((weekdayCompletions / weekdayPossible) * 100) : 0;

    // 8. Consistency Score
    const streakWeight = Math.min(currentStreak / 30, 1) * 40;
    const rateWeight = (overallCompletionRate / 100) * 40;
    const recoveryWeight = (avgGap <= 1 && !isFutureMonth ? 20 : avgGap <= 3 && !isFutureMonth ? 10 : 0);
    const consistencyScore = isFutureMonth ? 0 : Math.round(streakWeight + rateWeight + recoveryWeight);

    // 9. Heatmap Data (Keep global as requested)
    const heatmapData = [];
    Object.entries(dailyCompletionsMap).forEach(([date, count]) => {
        const intensity = count >= activeHabitsCount ? 4 : count >= activeHabitsCount * 0.75 ? 3 : count >= activeHabitsCount * 0.5 ? 2 : 1;
        heatmapData.push({ date, count, intensity });
    });

    // 10. Weekly Momentum
    let weeklyMomentum = 0;
    if (!isFutureMonth) {
        const startOfCurrentWeek = startOfWeek(referenceDate);
        const endOfCurrentWeek = endOfWeek(referenceDate);
        const startOfLastWeek = startOfWeek(subDays(referenceDate, 7));
        const endOfLastWeek = endOfWeek(subDays(referenceDate, 7));
        let currentWeekCompletions = 0;
        let lastWeekCompletions = 0;

        Object.entries(dailyCompletionsMap).forEach(([dateStr, count]) => {
            const d = new Date(dateStr);
            if (d >= startOfCurrentWeek && d <= endOfCurrentWeek) currentWeekCompletions += count;
            else if (d >= startOfLastWeek && d <= endOfLastWeek) lastWeekCompletions += count;
        });

        if (lastWeekCompletions > 0) weeklyMomentum = Math.round(((currentWeekCompletions - lastWeekCompletions) / lastWeekCompletions) * 100);
        else if (currentWeekCompletions > 0) weeklyMomentum = 100;
    }

    return {
        overview: {
            completionRate: overallCompletionRate,
            currentStreak,
            bestStreak: maxStreak,
            activeHabits: activeHabitsCount,
            weeklyMomentum
        },
        trends: { bestDay, worstDay, totalCompletionsLast30: isFutureMonth ? 0 : actualCompletionsMTD },
        insights: {
            recoveryMessage,
            longestGap: (gaps.length > 0 && !isFutureMonth) ? Math.max(...gaps) : 0,
            averageCompletionsPerDay: isFutureMonth ? "0.0" : (actualCompletionsMTD / (daysElapsedInContext || 1)).toFixed(1),
            weekendRate,
            weekdayRate,
            consistencyScore
        },
        rankings: {
            all: [...habits],  // Return a copy to avoid modifying the original array
            top: habits[0],
            bottom: habits[habits.length - 1]
        },
        heatmap: heatmapData
    };
};
