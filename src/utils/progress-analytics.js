function isSuccess(resolution) {
  return resolution === 'resisted' || resolution === 'interrupted';
}

function startOfLocalDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

function formatDayLabel(timestamp) {
  return new Date(timestamp).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2);
}

function timeWindowLabel(hour) {
  if (hour < 6) return 'Late night';
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
}

function buildProgressAnalytics(urges, now = Date.now()) {
  const totalLogs = urges.length;
  const resistedCount = urges.filter((urge) => isSuccess(urge.resolution)).length;
  const relapsedCount = urges.filter((urge) => urge.resolution === 'relapsed').length;
  const successRate = totalLogs > 0 ? Math.round((resistedCount / totalLogs) * 100) : 100;

  const triggerCounts = new Map();
  const windowCounts = new Map([
    ['Late night', 0],
    ['Morning', 0],
    ['Afternoon', 0],
    ['Evening', 0],
  ]);

  for (const urge of urges) {
    const trigger = (urge.trigger_type || 'Unknown').trim() || 'Unknown';
    triggerCounts.set(trigger, (triggerCounts.get(trigger) || 0) + 1);

    const window = timeWindowLabel(new Date(urge.timestamp).getHours());
    windowCounts.set(window, (windowCounts.get(window) || 0) + 1);
  }

  const topTriggers = Array.from(triggerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([trigger, count]) => ({
      trigger,
      count,
      share: totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0,
    }));

  const today = new Date(startOfLocalDay(now));
  const days = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    const dayStart = date.getTime();
    days.push({
      start: dayStart,
      label: formatDayLabel(dayStart),
      successes: 0,
      relapses: 0,
      total: 0,
    });
  }

  const dayIndex = new Map(days.map((day, index) => [day.start, index]));
  for (const urge of urges) {
    const index = dayIndex.get(startOfLocalDay(urge.timestamp));
    if (index === undefined) continue;
    const day = days[index];
    day.total += 1;
    if (isSuccess(urge.resolution)) day.successes += 1;
    if (urge.resolution === 'relapsed') day.relapses += 1;
  }

  let peakWindow = null;
  for (const [label, count] of windowCounts.entries()) {
    if (count === 0) continue;
    if (!peakWindow || count > peakWindow.count) {
      peakWindow = { label, count };
    }
  }

  const lastSevenDayTotal = days.reduce((sum, day) => sum + day.total, 0);

  return {
    totalLogs,
    resistedCount,
    relapsedCount,
    successRate,
    topTriggers,
    lastSevenDays: days,
    lastSevenDayTotal,
    peakWindow,
  };
}

module.exports = {
  buildProgressAnalytics,
  isSuccess,
};
