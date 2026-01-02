import {
    format,
    subDays,
    subMonths,
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
    const dailyCompletionsMap = {};
    const heatmapCompletionsMap = {};

    const currentMonthStart = startOfMonth(referenceDate);
    const currentMonthEnd = endOfMonth(referenceDate);
    const sixMonthsAgo = startOfMonth(subMonths(referenceDate, 5));

    habits.forEach(habit => {
        if (!habit.completions) return;
        habit.completions.forEach(c => {
            const completionDate = typeof c.date === 'string' ? new Date(c.date) : new Date(c.date);
            const dateStr = format(completionDate, 'yyyy-MM-dd');
            
            if (c.completed && completionDate >= currentMonthStart && completionDate <= currentMonthEnd) {
                dailyCompletionsMap[dateStr] = (dailyCompletionsMap[dateStr] || 0) + 1;
            }
            
            if (c.completed && completionDate >= sixMonthsAgo && completionDate <= today) {
                heatmapCompletionsMap[dateStr] = (heatmapCompletionsMap[dateStr] || 0) + 1;
            }
        });
    });

    const referenceDateStr = format(referenceDate, 'yyyy-MM-dd');
    const isFutureMonth = startOfMonth(targetDate) > startOfMonth(today);

    const completionDates = Object.keys(dailyCompletionsMap)
        .filter(d => d <= referenceDateStr)
        .sort();

    let currentStreak = 0;
    if (!isFutureMonth) {
        const monthStart = startOfMonth(referenceDate);
        const today = new Date(referenceDate);
        
        const monthDates = eachDayOfInterval({
            start: monthStart,
            end: today
        }).reverse();
        
        for (const date of monthDates) {
            const dateStr = format(date, 'yyyy-MM-dd');
            if (dailyCompletionsMap[dateStr] > 0) {
                currentStreak++;
            } else if (date.getTime() !== today.getTime()) {
                break;
            }
        }
    }

    let maxStreak = 0;
    if (!isFutureMonth) {
        const monthDates = eachDayOfInterval({
            start: startOfMonth(referenceDate),
            end: referenceDate
        });
        
        let tempStreak = 0;
        let bestStreak = 0;
        
        monthDates.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            if (dailyCompletionsMap[dateStr] > 0) {
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        });
        
        maxStreak = bestStreak;
    }

    const startOfSelectedMonth = startOfMonth(referenceDate);
    const daysElapsedInContext = isFutureMonth ? 0 : (differenceInDays(referenceDate, startOfSelectedMonth) + 1);
    
    let actualCompletionsMTD = 0;
    let totalPossibleCompletions = 0;
    
    if (!isFutureMonth) {
        const monthDates = eachDayOfInterval({
            start: startOfMonth(referenceDate),
            end: referenceDate
        });
        
        monthDates.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const completions = dailyCompletionsMap[dateStr] || 0;
            actualCompletionsMTD += completions;
            
            const activeHabitsOnDay = habits.filter(h => {
                const hStart = h.startDate ? new Date(h.startDate) : null;
                const hEnd = h.endDate ? new Date(h.endDate) : null;
                const hStartDate = hStart ? new Date(hStart.setHours(0,0,0,0)) : null;
                const hEndDate = hEnd ? new Date(hEnd.setHours(23,59,59,999)) : null;
                const currentDate = new Date(date);
                
                return (!hStartDate || currentDate >= hStartDate) && 
                       (!hEndDate || currentDate <= hEndDate);
            }).length;
            
            totalPossibleCompletions += activeHabitsOnDay;
        });
    }
    const completionRateMTD = totalPossibleCompletions > 0 
        ? Math.round((actualCompletionsMTD / totalPossibleCompletions) * 100)
        : 0;

    const gaps = [];
    if (!isFutureMonth) {
        const monthDates = eachDayOfInterval({
            start: startOfMonth(referenceDate),
            end: referenceDate
        });

        let lastCompletedDate = null;
        monthDates.forEach((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            if (dailyCompletionsMap[dateStr] > 0) {
                if (lastCompletedDate !== null) {
                    const daysBetween = differenceInDays(date, lastCompletedDate) - 1;
                    if (daysBetween > 0) {
                        gaps.push(daysBetween);
                    }
                }
                lastCompletedDate = date;
            }
        });
    }

    const avgGap = gaps.length > 0 
        ? (gaps.reduce((a, b) => a + b, 0) / gaps.length).toFixed(1) 
        : "0.0";
        
    const recoveryMessage = (gaps.length === 0) 
        ? (Object.keys(dailyCompletionsMap).length > 0 ? "Perfect consistency!" : "No activity yet") 
        : `${avgGap} day${avgGap === "1.0" ? '' : 's'}`;

    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const startOfWindow = subDays(referenceDate, 30);
    if (!isFutureMonth) {
        const daysInWindow = eachDayOfInterval({
            start: startOfWindow,
            end: referenceDate
        });

        daysInWindow.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dayOfWeek = getDay(date);
            dayCounts[dayOfWeek] += dailyCompletionsMap[dateStr] || 0;
        });
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const maxVal = Math.max(...dayCounts);
    const minVal = Math.min(...dayCounts.filter(val => val > 0));
    const bestDay = maxVal > 0 ? days[dayCounts.indexOf(maxVal)] : "None";
    const worstDay = (minVal > 0 && minVal < maxVal) ? days[dayCounts.indexOf(minVal)] : "None";

    let weekendCompletions = 0;
    let weekdayCompletions = 0;
    let weekendPossible = 0;
    let weekdayPossible = 0;

    if (!isFutureMonth) {
        const startDate = startOfMonth(referenceDate);
        const endDate = isSameDay(referenceDate, today) ? today : referenceDate;
        
        const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });
        
        daysInPeriod.forEach(d => {
            const dayIdx = getDay(d);
            const isWeekend = dayIdx === 0 || dayIdx === 6; // 0 = Sunday, 6 = Saturday
            const dStr = format(d, 'yyyy-MM-dd');
            
            // Calculate active habits for this day
            const activeHabitsOnDay = habits.filter(h => {
                const hStart = h.startDate ? new Date(h.startDate) : null;
                const hEnd = h.endDate ? new Date(h.endDate) : null;
                const hStartDate = hStart ? new Date(hStart.setHours(0,0,0,0)) : null;
                const hEndDate = hEnd ? new Date(hEnd.setHours(23,59,59,999)) : null;
                const currentDate = new Date(d);
                
                return (!hStartDate || currentDate >= hStartDate) && 
                       (!hEndDate || currentDate <= hEndDate);
            }).length;
            
            if (isWeekend) {
                weekendPossible += activeHabitsOnDay;
                weekendCompletions += (dailyCompletionsMap[dStr] || 0);
            } else {
                weekdayPossible += activeHabitsOnDay;
                weekdayCompletions += (dailyCompletionsMap[dStr] || 0);
            }
        });
    }

    const weekendRate = weekendPossible > 0 ? Math.round((weekendCompletions / weekendPossible) * 100) : 0;
    const weekdayRate = weekdayPossible > 0 ? Math.round((weekdayCompletions / weekdayPossible) * 100) : 0;

    const activeDays = Object.keys(dailyCompletionsMap).filter(d => {
        const date = new Date(d);
        return date <= (isSameDay(referenceDate, today) ? today : referenceDate);
    }).length;
    
    let totalAssignedTasks = 0;
    let totalCompletedTasks = 0;
    let daysWithCompletions = 0;
    
    if (!isFutureMonth) {
        const startDate = startOfMonth(referenceDate);
        const endDate = isSameDay(referenceDate, today) ? today : referenceDate;
        
        const daysToCheck = eachDayOfInterval({
            start: startDate,
            end: endDate
        });
        
        daysToCheck.forEach(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const activeHabitsOnDay = habits.filter(h => {
                const hStart = h.startDate ? new Date(h.startDate) : null;
                const hEnd = h.endDate ? new Date(h.endDate) : null;
                const hStartDate = hStart ? new Date(hStart.setHours(0,0,0,0)) : null;
                const hEndDate = hEnd ? new Date(hEnd.setHours(23,59,59,999)) : null;
                const currentDate = new Date(date);
                
                return (!hStartDate || currentDate >= hStartDate) && 
                       (!hEndDate || currentDate <= hEndDate);
            }).length;
            
            const completions = dailyCompletionsMap[dateStr] || 0;
            totalAssignedTasks += activeHabitsOnDay;
            totalCompletedTasks += completions;
            
            if (completions > 0) {
                daysWithCompletions++;
            }
        });
    }
    
    let consistencyScore = 0;
    
    if (!isFutureMonth && daysWithCompletions > 0) {
        const completionRate = totalAssignedTasks > 0 
            ? (totalCompletedTasks / totalAssignedTasks) * 70
            : 0;
        
        const totalDays = differenceInDays(
            isSameDay(referenceDate, today) ? today : referenceDate,
            startOfMonth(referenceDate)
        ) + 1;
        
        const consistency = (daysWithCompletions / totalDays) * 30;
        const baseScore = Math.round(completionRate + consistency);
        const streakBonus = currentStreak > 0 ? Math.min(20, currentStreak * 2) : 0;
        const gapPenalty = gaps.length > 0 
            ? Math.min(20, gaps.reduce((a, b) => a + b, 0) * 2) 
            : 0;
        
        consistencyScore = Math.max(0, Math.min(100, baseScore + streakBonus - gapPenalty));
    }

    const heatmapData = [];
    const heatmapEndDate = today;
    const heatmapStartDate = sixMonthsAgo;
    
    const allHeatmapDates = eachDayOfInterval({
        start: heatmapStartDate,
        end: heatmapEndDate
    });
    
    allHeatmapDates.forEach(date => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const count = heatmapCompletionsMap[dateStr] || 0;
        const intensity = count >= activeHabitsCount ? 4 : 
                         count >= activeHabitsCount * 0.75 ? 3 : 
                         count >= activeHabitsCount * 0.5 ? 2 : 
                         count > 0 ? 1 : 0;
        
        heatmapData.push({ 
            date: dateStr, 
            count, 
            intensity,
            isCurrentMonth: date.getMonth() === referenceDate.getMonth() && 
                          date.getFullYear() === referenceDate.getFullYear()
        });
    });

    let weeklyMomentum = 0;
    if (!isFutureMonth) {
        const startOfCurrentWeek = startOfWeek(referenceDate);
        const endOfCurrentWeek = endOfWeek(referenceDate);
        const startOfLastWeek = startOfWeek(subDays(referenceDate, 7));
        const endOfLastWeek = endOfWeek(subDays(referenceDate, 7));
        let currentWeekCompletions = 0;
        let lastWeekCompletions = 0;

        Object.entries(dailyCompletionsMap).forEach(([dateStr, count]) => {
            const date = new Date(dateStr);
            if (date >= startOfCurrentWeek && date <= endOfCurrentWeek) {
                currentWeekCompletions += count;
            } else if (date >= startOfLastWeek && date <= endOfLastWeek) {
                lastWeekCompletions += count;
            }
        });

        if (lastWeekCompletions > 0) {
            weeklyMomentum = Math.round(
                ((currentWeekCompletions - lastWeekCompletions) / lastWeekCompletions) * 100
            );
        } else if (currentWeekCompletions > 0) {
            weeklyMomentum = 100;
        }
    }

    return {
        overview: {
            completionRate: completionRateMTD,
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
