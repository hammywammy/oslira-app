// ============================================================================
// REACT & FRAMER MOTION IMPORTS
// ============================================================================
import { motion, useInView } from 'framer-motion'; // Remove AnimationControls, useAnimation
import { useState, useRef, useEffect } from 'react';

// ============================================================================
// ICONIFY (for icons throughout)
// ============================================================================
import { Icon } from '@iconify/react';

// ============================================================================
// RECHARTS - COMPLETE IMPORT LIST
// ============================================================================
import {
  // Chart containers
  LineChart,
  AreaChart,
  BarChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  ScatterChart,
  ComposedChart,
  FunnelChart,
  Treemap,
  
  // Chart elements
  Line,
  Area,
  Bar,
  Pie,
  Radar,
  RadialBar,
  Scatter,
  Funnel,
  
  // Cartesian components
  XAxis,
  YAxis,
  CartesianGrid,
  
  // Polar components
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  
  // Interactive components
  Tooltip,
  Legend,
  Brush,
  
  // Reference components
  ReferenceLine,
  ReferenceArea,
  
  // Layout & containers
  ResponsiveContainer,
  
  // Customization
  Cell,
  Sector,
  LabelList,
  
} from 'recharts';

// ============================================================================
// TYPESCRIPT INTERFACES - ALL DATA SHAPES
// ============================================================================


interface TimeSeriesData {
  date: string;
  value: number;
  revenue?: number;
  costs?: number;
  profit?: number;
  desktop?: number;
  mobile?: number;
  tablet?: number;
  forecast?: number;
  actual?: number;
}


interface CategoryData {
  name: string;
  value: number;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  email?: number;
  social?: number;
  direct?: number;
  referral?: number;
  fill?: string;
}


interface LeadData {
  id: string;
  name: string;
  score: number;
  engagement: number;
  followers: number;
  conversationRate?: number;
  revenue?: number;
  category?: string;
}


interface DistributionData {
  name: string;
  value: number;
  percentage?: number;
  fill: string;
}


interface FunnelStageData {
  stage: string;
  value: number;
  fill: string;
  percentage?: number;
}


interface ScatterData {
  x: number;
  y: number;
  z?: number;
  name?: string;
  category?: string;
  score?: number;
}

interface RadarData {
  subject: string;
  A: number;
  B: number;
  fullMark: number;
}

interface TreemapData {
  name: string;
  size: number;
  fill: string;
  children?: TreemapData[];
}


interface SankeyNode {
  name: string;
}


interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}


interface HeatmapCell {
  day: number;
  hour: number;
  value: number;
  dayLabel: string;
  hourLabel: string;
}


interface WaterfallData {
  name: string;
  value: number;
  type: 'start' | 'increase' | 'decrease' | 'total';
  cumulativeValue?: number;
}

interface DrillDownData {
  name: string;
  value: number;
  regions?: string[];
  children?: CategoryData[];
}


interface LiveDataPoint {
  time: string;
  value: number;
  timestamp?: number;
}


interface SyncData {
  month: string;
  revenue: number;
  leads: number;
  conversion: number;
}


interface BiaxialData {
  name: string;
  leftValue: number;
  rightValue: number;
}


interface CustomTooltipData {
  active?: boolean;
  payload?: any[];
  label?: string;
}


interface LegendState {
  [key: string]: boolean;
}


interface ActiveShapeProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: any;
  percent: number;
  value: number;
}

interface ReferenceLineConfig {
  y?: number;
  x?: string | number;
  stroke: string;
  strokeDasharray?: string;
  label?: string;
}

interface GradientConfig {
  id: string;
  colors: Array<{
    offset: string;
    color: string;
    opacity?: number;
  }>;
}

interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}


interface ChartSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  chartCount: number;
}

// ============================================================================
// TYPESCRIPT ENUMS
// ============================================================================

/**
 * Chart Types Enum
 */
enum ChartType {
  LINE = 'line',
  AREA = 'area',
  BAR = 'bar',
  PIE = 'pie',
  RADAR = 'radar',
  SCATTER = 'scatter',
  COMPOSED = 'composed',
  FUNNEL = 'funnel',
  TREEMAP = 'treemap',
  SANKEY = 'sankey',
}

/**
 * Lead Quality Categories
 */
enum LeadQuality {
  EXCELLENT = 'Excellent',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor',
}

/**
 * Device Types
 */
enum DeviceType {
  DESKTOP = 'desktop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
}

/**
 * Traffic Sources
 */
enum TrafficSource {
  ORGANIC = 'Organic',
  SOCIAL = 'Social',
  DIRECT = 'Direct',
  REFERRAL = 'Referral',
  EMAIL = 'Email',
}

/**
 * Funnel Stages
 */
enum FunnelStage {
  LEADS = 'Leads',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  DEMO = 'Demo',
  PROPOSAL = 'Proposal',
  CLOSED = 'Closed',
}

// ============================================================================
// EXPORT TYPES (for use in other files if needed)
// ============================================================================

export type {
  TimeSeriesData,
  CategoryData,
  LeadData,
  DistributionData,
  FunnelStageData,
  ScatterData,
  RadarData,
  TreemapData,
  SankeyData,
  SankeyNode,
  SankeyLink,
  HeatmapCell,
  WaterfallData,
  DrillDownData,
  LiveDataPoint,
  SyncData,
  BiaxialData,
  CustomTooltipData,
  LegendState,
  ActiveShapeProps,
  ReferenceLineConfig,
  GradientConfig,
  AnimationConfig,
  ChartSection,
};

export {
  ChartType,
  LeadQuality,
  DeviceType,
  TrafficSource,
  FunnelStage,
};

// ============================================================================
// DATA GENERATORS - SECTION 1: BASIC CARTESIAN
// ============================================================================

/**
 * Generate monthly revenue data (12 months)
 * Used for: Simple line chart
 */
const generateMonthlyRevenue = (): TimeSeriesData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    date: month,
    value: 15000 + Math.random() * 25000 + (i * 3000),
  }));
};

/**
 * Generate multi-line comparison data
 * Used for: Multi-line chart (revenue, costs, profit)
 */
const generateMultiLineData = (): TimeSeriesData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => ({
    date: month,
    revenue: 30000 + Math.random() * 20000 + (i * 2000),
    costs: 15000 + Math.random() * 10000 + (i * 800),
    profit: 10000 + Math.random() * 8000 + (i * 1200),
    value: 0,
  }));
};

/**
 * Generate cumulative user growth
 * Used for: Simple area chart
 */
const generateUserGrowth = (): TimeSeriesData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let cumulative = 1000;
  return months.map((month) => {
    cumulative += Math.random() * 500 + 300;
    return {
      date: month,
      value: Math.round(cumulative),
    };
  });
};

/**
 * Generate stacked area data (device traffic)
 * Used for: Stacked area chart
 */
const generateStackedArea = (): TimeSeriesData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month) => ({
    date: month,
    desktop: Math.round(3000 + Math.random() * 2000),
    mobile: Math.round(2000 + Math.random() * 1500),
    tablet: Math.round(800 + Math.random() * 600),
    value: 0,
  }));
};

/**
 * Generate category data (product sales)
 * Used for: Simple bar chart
 */
const generateCategoryData = (): CategoryData[] => {
  return [
    { name: 'Electronics', value: 45000 },
    { name: 'Clothing', value: 32000 },
    { name: 'Food', value: 28000 },
    { name: 'Books', value: 19000 },
    { name: 'Toys', value: 15000 },
    { name: 'Sports', value: 12000 },
  ];
};

/**
 * Generate grouped bar data (quarterly regional sales)
 * Used for: Grouped bar chart
 */
const generateGroupedBar = (): CategoryData[] => {
  return [
    { name: 'North', q1: 12000, q2: 15000, q3: 18000, q4: 21000, value: 0 },
    { name: 'South', q1: 10000, q2: 13000, q3: 15000, q4: 17000, value: 0 },
    { name: 'East', q1: 14000, q2: 16000, q3: 19000, q4: 23000, value: 0 },
    { name: 'West', q1: 11000, q2: 14000, q3: 16000, q4: 19000, value: 0 },
  ];
};

/**
 * Generate stacked bar data (lead sources)
 * Used for: Stacked bar chart
 */
const generateStackedBar = (): CategoryData[] => {
  return [
    { name: 'Jan', email: 4000, social: 2400, direct: 2400, referral: 1200, value: 0 },
    { name: 'Feb', email: 3000, social: 1398, direct: 2210, referral: 980, value: 0 },
    { name: 'Mar', email: 2000, social: 9800, direct: 2290, referral: 1500, value: 0 },
    { name: 'Apr', email: 2780, social: 3908, direct: 2000, referral: 1100, value: 0 },
    { name: 'May', email: 1890, social: 4800, direct: 2181, referral: 1300, value: 0 },
    { name: 'Jun', email: 2390, social: 3800, direct: 2500, referral: 1400, value: 0 },
  ];
};

/**
 * Generate horizontal bar data (top performers)
 * Used for: Horizontal bar chart
 */
const generateHorizontalBar = (): CategoryData[] => {
  return [
    { name: '@fitnessguru_pro', value: 95 },
    { name: '@lifestyle_maven', value: 92 },
    { name: '@tech_wizard', value: 88 },
    { name: '@foodie_paradise', value: 85 },
    { name: '@travel_seeker', value: 82 },
    { name: '@fashion_icon', value: 79 },
    { name: '@music_vibes', value: 76 },
    { name: '@art_collector', value: 73 },
    { name: '@pet_lovers_hub', value: 70 },
    { name: '@gaming_master', value: 67 },
  ];
};

// ============================================================================
// DATA GENERATORS - SECTION 2: ADVANCED COMPOSITIONS
// ============================================================================

/**
 * Generate composed chart data (daily + cumulative)
 * Used for: ComposedChart (Line + Bar)
 */
const generateComposedData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let runningTotal = 0;
  return days.map((day) => {
    const daily = Math.round(1000 + Math.random() * 2000);
    runningTotal += daily;
    return {
      name: day,
      daily,
      total: runningTotal,
    };
  });
};

/**
 * Generate response time data (min/max/avg)
 * Used for: ComposedChart (Area + Line)
 */
const generateResponseTimeData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  return hours.map((hour) => ({
    name: hour,
    min: Math.round(100 + Math.random() * 50),
    max: Math.round(300 + Math.random() * 200),
    avg: Math.round(200 + Math.random() * 100),
  }));
};

/**
 * Generate dual axis data (revenue + leads)
 * Used for: Dual Y-Axis Chart
 */
const generateDualAxisData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    name: month,
    revenue: Math.round(50000 + Math.random() * 30000),
    leads: Math.round(100 + Math.random() * 150),
  }));
};

/**
 * Generate scatter plot data (correlation analysis)
 * Used for: Scatter Plot
 */
const generateScatterData = (): ScatterData[] => {
  return Array.from({ length: 50 }, () => ({
    x: Math.round(40 + Math.random() * 60),
    y: Math.round(10 + Math.random() * 40),
    z: Math.round(5000 + Math.random() * 45000),
  }));
};

/**
 * Generate mixed chart data (bar + line + area)
 * Used for: Mixed Types Chart
 */
const generateMixedChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    name: month,
    sales: Math.round(15000 + Math.random() * 10000),
    trend: Math.round(18000 + Math.random() * 8000),
    forecast: Math.round(20000 + Math.random() * 12000),
  }));
};

/**
 * Generate biaxial data (visits + conversion rate)
 * Used for: Biaxial Line Chart
 */
const generateBiaxialData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map((week) => ({
    name: week,
    visits: Math.round(5000 + Math.random() * 3000),
    rate: Number((2 + Math.random() * 3).toFixed(2)),
  }));
};

/**
 * Generate target vs actual data
 * Used for: Reference Lines Chart
 */
const generateTargetData = () => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  return quarters.map((quarter) => ({
    name: quarter,
    actual: Math.round(70000 + Math.random() * 30000),
    target: 90000,
  }));
};

// ============================================================================
// DATA GENERATORS - SECTION 3: CIRCULAR & RADIAL
// ============================================================================

/**
 * Generate pie chart data (lead quality)
 * Used for: Simple Pie Chart
 */
const generatePieData = (): DistributionData[] => {
  return [
    { name: 'Excellent', value: 35, fill: '#10b981' },
    { name: 'Good', value: 28, fill: '#3b82f6' },
    { name: 'Fair', value: 22, fill: '#f59e0b' },
    { name: 'Poor', value: 15, fill: '#ef4444' },
  ];
};

/**
 * Generate donut chart data (traffic sources)
 * Used for: Donut Chart
 */
const generateDonutData = (): DistributionData[] => {
  return [
    { name: 'Organic', value: 45, fill: '#8b5cf6' },
    { name: 'Social', value: 30, fill: '#ec4899' },
    { name: 'Direct', value: 15, fill: '#06b6d4' },
    { name: 'Referral', value: 10, fill: '#10b981' },
  ];
};

/**
 * Generate pie data with custom labels (revenue by product)
 * Used for: Pie with Custom Labels
 */
const generateCustomLabelPie = (): DistributionData[] => {
  return [
    { name: 'Product A', value: 4800, fill: '#3b82f6' },
    { name: 'Product B', value: 3200, fill: '#10b981' },
    { name: 'Product C', value: 2400, fill: '#f59e0b' },
    { name: 'Product D', value: 1600, fill: '#ef4444' },
    { name: 'Product E', value: 1200, fill: '#8b5cf6' },
  ];
};

/**
 * Generate radial bar data (goal completion)
 * Used for: RadialBar Chart
 */
const generateRadialBarData = () => {
  return [
    { name: 'Sales', value: 85, fill: '#ef4444' },
    { name: 'Marketing', value: 72, fill: '#f97316' },
    { name: 'Product', value: 91, fill: '#eab308' },
    { name: 'Support', value: 68, fill: '#10b981' },
  ];
};

/**
 * Generate radar chart data (product comparison)
 * Used for: Radar Chart
 */
const generateRadarData = (): RadarData[] => {
  return [
    { subject: 'Features', A: 85, B: 72, fullMark: 100 },
    { subject: 'Performance', A: 92, B: 88, fullMark: 100 },
    { subject: 'Design', A: 78, B: 95, fullMark: 100 },
    { subject: 'Price', A: 88, B: 65, fullMark: 100 },
    { subject: 'Support', A: 70, B: 92, fullMark: 100 },
    { subject: 'Reliability', A: 95, B: 80, fullMark: 100 },
  ];
};

// ============================================================================
// DATA GENERATORS - SECTION 4: SPECIALIZED CHARTS
// ============================================================================

/**
 * Generate treemap data (org structure)
 * Used for: Treemap
 */
const generateTreemapData = (): TreemapData[] => {
  return [
    { name: 'Engineering', size: 45, fill: '#3b82f6' },
    { name: 'Sales', size: 30, fill: '#10b981' },
    { name: 'Marketing', size: 25, fill: '#f59e0b' },
    { name: 'Product', size: 20, fill: '#8b5cf6' },
    { name: 'Support', size: 15, fill: '#ec4899' },
    { name: 'HR', size: 10, fill: '#06b6d4' },
  ];
};


/**
 * Generate funnel data (conversion pipeline)
 * Used for: Funnel Chart
 */
const generateFunnelData = (): FunnelStageData[] => {
  return [
    { stage: 'Leads', value: 1000, fill: '#3b82f6' },
    { stage: 'Qualified', value: 650, fill: '#8b5cf6' },
    { stage: 'Demo', value: 420, fill: '#ec4899' },
    { stage: 'Proposal', value: 280, fill: '#f59e0b' },
    { stage: 'Closed', value: 150, fill: '#10b981' },
  ];
};

/**
 * Generate waterfall data (budget breakdown)
 * Used for: Waterfall Chart
 */
const generateWaterfallData = (): WaterfallData[] => {
  return [
    { name: 'Start', value: 100000, type: 'start' },
    { name: 'Revenue', value: 50000, type: 'increase' },
    { name: 'Costs', value: -30000, type: 'decrease' },
    { name: 'Marketing', value: -15000, type: 'decrease' },
    { name: 'Operations', value: -20000, type: 'decrease' },
    { name: 'Net', value: 85000, type: 'total' },
  ];
};

/**
 * Generate heatmap data (activity by day/hour)
 * Used for: Heatmap
 */
const generateHeatmapData = (): HeatmapCell[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['6am', '9am', '12pm', '3pm', '6pm', '9pm'];
  const data: HeatmapCell[] = [];
  
  days.forEach((day, dayIndex) => {
    hours.forEach((hour, hourIndex) => {
      data.push({
        day: dayIndex,
        hour: hourIndex,
        value: Math.round(20 + Math.random() * 80),
        dayLabel: day,
        hourLabel: hour,
      });
    });
  });
  
  return data;
};

// ============================================================================
// DATA GENERATORS - SECTION 5: INTERACTIVE FEATURES
// ============================================================================

/**
 * Generate brush data (12 months for zooming)
 * Used for: Brush & Zoom
 */
const generateBrushData = () => {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    months.push({
      month: `Month ${i}`,
      sales: Math.round(10000 + Math.random() * 15000),
      leads: Math.round(50 + Math.random() * 100),
    });
  }
  return months;
};

/**
 * Generate synchronized chart data
 * Used for: Synchronized Charts
 */
const generateSyncData = (): SyncData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month) => ({
    month,
    revenue: Math.round(30000 + Math.random() * 20000),
    leads: Math.round(80 + Math.random() * 60),
    conversion: Number((2 + Math.random() * 3).toFixed(1)),
  }));
};

/**
 * Generate drill-down data (region → country)
 * Used for: Click Drill-Down
 */
const generateDrillDownData = (): DrillDownData[] => {
  return [
    { 
      name: 'North America', 
      value: 45000, 
      regions: ['USA', 'Canada', 'Mexico'],
      children: [
        { name: 'USA', value: 30000 },
        { name: 'Canada', value: 10000 },
        { name: 'Mexico', value: 5000 },
      ]
    },
    { 
      name: 'Europe', 
      value: 38000, 
      regions: ['UK', 'Germany', 'France'],
      children: [
        { name: 'UK', value: 15000 },
        { name: 'Germany', value: 13000 },
        { name: 'France', value: 10000 },
      ]
    },
    { 
      name: 'Asia', 
      value: 52000, 
      regions: ['China', 'Japan', 'India'],
      children: [
        { name: 'China', value: 25000 },
        { name: 'Japan', value: 17000 },
        { name: 'India', value: 10000 },
      ]
    },
    { 
      name: 'South America', 
      value: 22000, 
      regions: ['Brazil', 'Argentina', 'Chile'],
      children: [
        { name: 'Brazil', value: 12000 },
        { name: 'Argentina', value: 6000 },
        { name: 'Chile', value: 4000 },
      ]
    },
  ];
};

/**
 * Generate live data stream (real-time simulation)
 * Used for: Dynamic Data Update
 */
const generateLiveData = (length: number): LiveDataPoint[] => {
  return Array.from({ length }, (_, i) => ({
    time: `T${i}`,
    value: Math.round(50 + Math.random() * 50),
    timestamp: Date.now() - (length - i) * 1000,
  }));
};


// ============================================================================
// DATA GENERATORS - SECTION 8: OSLIRA USE CASES
// ============================================================================

/**
 * Generate lead score distribution (Oslira)
 * Used for: Lead Score Distribution Pie
 */
const generateLeadScoreDistribution = (): DistributionData[] => {
  return [
    { name: 'Excellent (90-100)', value: 125, fill: '#10b981', percentage: 25 },
    { name: 'Good (70-89)', value: 200, fill: '#3b82f6', percentage: 40 },
    { name: 'Fair (50-69)', value: 125, fill: '#f59e0b', percentage: 25 },
    { name: 'Poor (0-49)', value: 50, fill: '#ef4444', percentage: 10 },
  ];
};

/**
 * Generate 6-month engagement trend (Oslira)
 * Used for: Engagement Trend Chart
 */
const generateEngagementTrend = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  let cumulative = 500;
  return months.map((month) => {
    const daily = Math.round(80 + Math.random() * 120);
    cumulative += daily;
    return {
      month,
      daily,
      cumulative: Math.round(cumulative),
      avgEngagement: Number((50 + Math.random() * 30).toFixed(1)),
    };
  });
};

/**
 * Generate conversion funnel (Oslira pipeline)
 * Used for: Conversion Funnel Chart
 */
const generateOsliraFunnel = (): FunnelStageData[] => {
  return [
    { stage: 'Leads Scraped', value: 5000, fill: '#3b82f6', percentage: 100 },
    { stage: 'Contacted', value: 3500, fill: '#8b5cf6', percentage: 70 },
    { stage: 'Qualified', value: 2000, fill: '#ec4899', percentage: 40 },
    { stage: 'Converted', value: 800, fill: '#10b981', percentage: 16 },
  ];
};

/**
 * Generate top Instagram leads (Oslira)
 * Used for: Top Leads Horizontal Bar
 */
const generateTopInstagramLeads = (): LeadData[] => {
  return [
    { id: '1', name: '@fitinfluencer', score: 98, engagement: 8.5, followers: 250000 },
    { id: '2', name: '@healthylifestyle', score: 95, engagement: 7.2, followers: 180000 },
    { id: '3', name: '@workoutdaily', score: 92, engagement: 6.8, followers: 150000 },
    { id: '4', name: '@nutritiontips', score: 89, engagement: 6.2, followers: 120000 },
    { id: '5', name: '@gymvibes', score: 86, engagement: 5.9, followers: 95000 },
    { id: '6', name: '@yogamaster', score: 83, engagement: 5.4, followers: 80000 },
    { id: '7', name: '@runninglife', score: 80, engagement: 5.1, followers: 65000 },
    { id: '8', name: '@strongbody', score: 77, engagement: 4.8, followers: 55000 },
    { id: '9', name: '@fitfam', score: 74, engagement: 4.5, followers: 45000 },
    { id: '10', name: '@activelifestyle', score: 71, engagement: 4.2, followers: 38000 },
  ];
};

/**
 * Generate monthly performance (Oslira revenue + volume)
 * Used for: Monthly Performance Composed Chart
 */
const generateMonthlyPerformance = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, i) => ({
    month,
    analyses: Math.round(80 + Math.random() * 120 + (i * 20)),
    revenue: Math.round(8000 + Math.random() * 12000 + (i * 2000)),
    avgScore: Math.round(65 + Math.random() * 25),
  }));
};

/**
 * Generate credit usage (Oslira consumption)
 * Used for: Credit Usage Stacked Area
 */
const generateCreditUsage = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((month, i) => ({
    month,
    lightAnalysis: Math.round(150 + Math.random() * 100 + (i * 20)),
    deepAnalysis: Math.round(80 + Math.random() * 60 + (i * 15)),
    premiumFeatures: Math.round(40 + Math.random() * 40 + (i * 10)),
  }));
};
// ============================================================================
// COLOR SCHEMES - FERRARI PALETTE
// ============================================================================

/**
 * Primary color palette (Ferrari-inspired reds, oranges, racing colors)
 */
const COLORS = {
  // Ferrari signature colors
  primary: '#ef4444',      // Ferrari Red
  secondary: '#f97316',    // Racing Orange
  accent: '#eab308',       // Speed Yellow
  
  // Business metrics
  success: '#10b981',      // Green (positive)
  danger: '#ef4444',       // Red (negative)
  warning: '#f59e0b',      // Amber (caution)
  info: '#3b82f6',         // Blue (neutral)
  
  // Extended palette
  purple: '#8b5cf6',       // Violet
  cyan: '#06b6d4',         // Cyan
  pink: '#ec4899',         // Pink
  emerald: '#10b981',      // Emerald
  
  // Lead quality colors
  excellent: '#10b981',    // Green
  good: '#3b82f6',         // Blue
  fair: '#f59e0b',         // Amber
  poor: '#ef4444',         // Red
  
  // Gradients (for defs)
  gradients: {
    ferrari: ['#ef4444', '#f97316', '#eab308'],
    ocean: ['#06b6d4', '#3b82f6', '#8b5cf6'],
    sunset: ['#f97316', '#ec4899', '#8b5cf6'],
    forest: ['#10b981', '#22c55e', '#84cc16'],
    fire: ['#ef4444', '#f97316', '#eab308'],
    ice: ['#06b6d4', '#3b82f6', '#6366f1'],
    royal: ['#8b5cf6', '#a855f7', '#c084fc'],
    neon: ['#ec4899', '#f472b6', '#fb7185'],
  },
  
  // Chart-specific colors
  line: '#8b5cf6',
  area: '#06b6d4',
  bar: '#f59e0b',
  pie: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  
  // Dark mode colors
  dark: {
    bg: '#0a0a0a',
    card: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    textMuted: '#9ca3af',
    grid: 'rgba(255, 255, 255, 0.1)',
  },
};

/**
 * Section color mapping
 */
const SECTION_COLORS = {
  section1: '#ef4444',    // Red - Basic Cartesian
  section2: '#f97316',    // Orange - Advanced Compositions
  section3: '#8b5cf6',    // Purple - Circular & Radial
  section4: '#10b981',    // Green - Specialized
  section5: '#3b82f6',    // Blue - Interactive
  section6: '#ec4899',    // Pink - Styling
  section7: '#06b6d4',    // Cyan - Annotations
  section8: '#eab308',    // Yellow - Oslira Use Cases
};

// ============================================================================
// ANIMATION VARIANTS - FRAMER MOTION
// ============================================================================

/**
 * Container stagger animation
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Card entrance animation
 */
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Chart scale-in animation
 */
const chartVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide from left animation
 */
const slideLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Slide from right animation
 */
const slideRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * Fade in animation (simple)
 */
const fadeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

/**
 * Scale bounce animation
 */
const bounceVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
};

/**
 * Hero text cascade
 */
const heroTextVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: 'easeOut',
    },
  }),
};

// ============================================================================
// CUSTOM TOOLTIP STYLES
// ============================================================================

/**
 * Default tooltip style (dark mode)
 */
const defaultTooltipStyle = {
  backgroundColor: '#1f2937',
  border: '1px solid #374151',
  borderRadius: '12px',
  padding: '12px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
};

/**
 * Ferrari-styled tooltip
 */
const ferrariTooltipStyle = {
  backgroundColor: 'rgba(239, 68, 68, 0.95)',
  border: '2px solid #f97316',
  borderRadius: '12px',
  padding: '12px',
  boxShadow: '0 10px 40px rgba(239, 68, 68, 0.4)',
  backdropFilter: 'blur(10px)',
};

/**
 * Minimal tooltip style
 */
const minimalTooltipStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Render active pie shape (hover effect)
 */
const renderActiveShape = (props: unknown) => {
  const typedProps = props as ActiveShapeProps;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = typedProps;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-xl font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#fff"
        className="text-sm font-semibold"
      >
        {`${value}`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#9ca3af"
        className="text-xs"
      >
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  );
};

/**
 * Custom label for pie chart (outside with lines)
 */
const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, fill, payload, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={fill}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="text-sm font-semibold"
    >
      {`${payload.name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/**
 * Format large numbers with K/M suffix
 */
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format currency
 */
const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format percentage
 */
const formatPercent = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

/**
 * Get color by value (for heatmaps)
 */
const getHeatmapColor = (value: number): string => {
  if (value < 20) return '#1e3a8a'; // Dark blue
  if (value < 40) return '#3b82f6'; // Blue
  if (value < 60) return '#f59e0b'; // Amber
  if (value < 80) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

/**
 * Get gradient color stops for value
 */
const getGradientStops = (gradientName: keyof typeof COLORS.gradients) => {
  const colors = COLORS.gradients[gradientName];
  const step = 100 / (colors.length - 1);
  return colors.map((color, i) => ({
    offset: `${i * step}%`,
    color,
    opacity: 1,
  }));
};

/**
 * Custom treemap content renderer
 */
const renderTreemapContent = (props: any) => {
  const { x, y, width, height, name, size, fill } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        stroke="#fff"
        strokeWidth={2}
        rx={8}
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            className="text-sm font-bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="#fff"
            className="text-xs opacity-80"
          >
            {size}
          </text>
        </>
      )}
    </g>
  );
};

/**
 * Custom funnel label
 */
const renderFunnelLabel = (props: any) => {
  const { x, y, width, height, value, stage, percentage } = props;
  
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      textAnchor="middle"
      fill="#fff"
      className="text-sm font-bold"
    >
      {`${stage}: ${value}`}
      {percentage && (
        <tspan x={x + width / 2} dy={20} className="text-xs opacity-80">
          {`${percentage}%`}
        </tspan>
      )}
    </text>
  );
};

/**
 * Calculate waterfall cumulative values
 */
const calculateWaterfallCumulative = (data: WaterfallData[]): WaterfallData[] => {
  let cumulative = 0;
  return data.map((item) => {
    if (item.type === 'start') {
      cumulative = item.value;
    } else if (item.type !== 'total') {
      cumulative += item.value;
    }
    return {
      ...item,
      cumulativeValue: cumulative,
    };
  });
};

/**
 * Custom axis tick formatter
 */
const formatAxisTick = (value: any, type: 'number' | 'currency' | 'percent' = 'number'): string => {
  if (type === 'currency') return formatCurrency(value);
  if (type === 'percent') return formatPercent(value);
  return formatNumber(value);
};

/**
 * Get responsive chart height based on screen size
 */
const getResponsiveHeight = (baseHeight: number = 400): number => {
  if (typeof window === 'undefined') return baseHeight;
  
  const width = window.innerWidth;
  if (width < 640) return baseHeight * 0.7; // Mobile
  if (width < 1024) return baseHeight * 0.85; // Tablet
  return baseHeight; // Desktop
};

/**
 * Debounce function for performance
 */
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate gradient ID for unique defs
 */
const generateGradientId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Custom legend formatter
 */
const formatLegendValue = (value: string): string => {
  // Convert camelCase to Title Case
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

/**
 * Calculate percentage from total
 */
const calculatePercentage = (value: number, total: number): number => {
  return (value / total) * 100;
};

/**
 * Get lead quality color
 */
const getLeadQualityColor = (score: number): string => {
  if (score >= 90) return COLORS.excellent;
  if (score >= 70) return COLORS.good;
  if (score >= 50) return COLORS.fair;
  return COLORS.poor;
};

/**
 * Format timestamp to relative time
 */
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
};

// ============================================================================
// CHART CONFIGURATION PRESETS
// ============================================================================

/**
 * Default chart margins
 */
const DEFAULT_MARGINS = {
  top: 20,
  right: 30,
  left: 20,
  bottom: 20,
};

/**
 * Large chart margins (for labels)
 */
const LARGE_MARGINS = {
  top: 30,
  right: 50,
  left: 50,
  bottom: 30,
};

/**
 * Animation configuration
 */
const CHART_ANIMATION = {
  duration: 800,
  easing: 'ease-out',
};

/**
 * Grid configuration
 */
const GRID_CONFIG = {
  strokeDasharray: '3 3',
  stroke: 'rgba(255, 255, 255, 0.1)',
};

/**
 * Axis configuration
 */
const AXIS_CONFIG = {
  stroke: '#9ca3af',
  style: {
    fontSize: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
};

// ============================================================================
// SECTION METADATA
// ============================================================================

/**
 * Section information for navigation/headers
 */
const SECTIONS: ChartSection[] = [
  {
    id: 'section-1',
    title: 'Basic Cartesian Charts',
    subtitle: 'The foundation of data visualization',
    icon: 'mdi:chart-line',
    color: SECTION_COLORS.section1,
    chartCount: 8,
  },
  {
    id: 'section-2',
    title: 'Advanced Compositions',
    subtitle: 'Complex multi-chart visualizations',
    icon: 'mdi:chart-box-plus-outline',
    color: SECTION_COLORS.section2,
    chartCount: 7,
  },
  {
    id: 'section-3',
    title: 'Circular & Radial Charts',
    subtitle: 'Non-cartesian visualizations',
    icon: 'mdi:chart-pie',
    color: SECTION_COLORS.section3,
    chartCount: 6,
  },
  {
    id: 'section-4',
    title: 'Specialized Charts',
    subtitle: 'Advanced chart types',
    icon: 'mdi:chart-tree',
    color: SECTION_COLORS.section4,
    chartCount: 5,
  },
  {
    id: 'section-5',
    title: 'Interactive Features',
    subtitle: 'User interactions and dynamic behaviors',
    icon: 'mdi:cursor-pointer',
    color: SECTION_COLORS.section5,
    chartCount: 10,
  },
  {
    id: 'section-6',
    title: 'Styling & Theming',
    subtitle: 'Visual customization showcase',
    icon: 'mdi:palette',
    color: SECTION_COLORS.section6,
    chartCount: 8,
  },
  {
    id: 'section-7',
    title: 'Annotations & References',
    subtitle: 'Adding context to charts',
    icon: 'mdi:target',
    color: SECTION_COLORS.section7,
    chartCount: 6,
  },
  {
    id: 'section-8',
    title: 'Oslira Use Cases',
    subtitle: 'Real CRM analytics scenarios',
    icon: 'mdi:instagram',
    color: SECTION_COLORS.section8,
    chartCount: 10,
  },
];

// ============================================================================
// EXPORT ALL CONSTANTS & HELPERS
// ============================================================================

export {
  COLORS,
  SECTION_COLORS,
  containerVariants,
  itemVariants,
  chartVariants,
  slideLeftVariants,
  slideRightVariants,
  fadeVariants,
  bounceVariants,
  heroTextVariants,
  defaultTooltipStyle,
  ferrariTooltipStyle,
  minimalTooltipStyle,
  renderActiveShape,
  renderCustomLabel,
  formatNumber,
  formatCurrency,
  formatPercent,
  getHeatmapColor,
  getGradientStops,
  renderTreemapContent,
  renderFunnelLabel,
  calculateWaterfallCumulative,
  formatAxisTick,
  getResponsiveHeight,
  debounce,
  generateGradientId,
  formatLegendValue,
  calculatePercentage,
  getLeadQualityColor,
  formatRelativeTime,
  DEFAULT_MARGINS,
  LARGE_MARGINS,
  CHART_ANIMATION,
  GRID_CONFIG,
  AXIS_CONFIG,
  SECTIONS,
};


export default function FerrariRechartsShowcase() {
  // ========================================================================
  // STATE & REFS
  // ========================================================================
  
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  
  const [activePieIndex, setActivePieIndex] = useState(0);
  const [liveData, setLiveData] = useState(generateLiveData(10));
  const [showLegend, setShowLegend] = useState({ revenue: true, costs: true, profit: true });
  
  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => {
        const newData = [...prev.slice(1), {
          time: `T${prev.length}`,
          value: Math.round(50 + Math.random() * 50),
        }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black text-white">
      
      {/* ====================================================================
          HERO SECTION
      ==================================================================== */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 py-20"
      >
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Icon icon="mdi:car-sports" className="text-9xl text-red-500 mx-auto" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-6"
          >
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              FERRARI
            </span>
            <br />
            <span className="text-white">RECHARTS</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl text-gray-400 mb-12"
          >
            60+ Nuclear Data Visualizations
          </motion.p>
        </div>
      </motion.section>

      {/* ====================================================================
          SECTION 1: BASIC CARTESIAN CHARTS (8 CHARTS)
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-red-500 font-bold text-sm uppercase tracking-wider">Section 1</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">
              Basic Cartesian Charts
            </h2>
            <p className="text-xl text-gray-400">The foundation of data visualization</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >

            {/* Chart 1: Simple Line Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-red-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-line" className="text-4xl text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold">1. Simple Line Chart</h3>
                  <p className="text-sm text-gray-400">Monthly revenue trend</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <defs>
                    <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#lineGrad1)"
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 2: Multi-Line Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-multiple" className="text-4xl text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">2. Multi-Line Chart</h3>
                  <p className="text-sm text-gray-400">Revenue, costs, and profit comparison</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMultiLineData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                  <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={3} />
                  <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 3: Simple Area Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-areaspline" className="text-4xl text-cyan-500" />
                <div>
                  <h3 className="text-2xl font-bold">3. Simple Area Chart</h3>
                  <p className="text-sm text-gray-400">User growth over time</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generateUserGrowth()}>
                  <defs>
                    <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    fill="url(#areaGrad1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 4: Stacked Area Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-timeline-variant" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">4. Stacked Area Chart</h3>
                  <p className="text-sm text-gray-400">Traffic by device type</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generateStackedArea()}>
                  <defs>
                    <linearGradient id="desktop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="mobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="tablet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="desktop" stackId="1" stroke="#3b82f6" fill="url(#desktop)" />
                  <Area type="monotone" dataKey="mobile" stackId="1" stroke="#8b5cf6" fill="url(#mobile)" />
                  <Area type="monotone" dataKey="tablet" stackId="1" stroke="#ec4899" fill="url(#tablet)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 5: Simple Bar Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-bar" className="text-4xl text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">5. Simple Bar Chart</h3>
                  <p className="text-sm text-gray-400">Sales by category</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateCategoryData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#eab308" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 6: Grouped Bar Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-bar-stacked" className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">6. Grouped Bar Chart</h3>
                  <p className="text-sm text-gray-400">Quarterly revenue by region</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateGroupedBar()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="q1" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="q2" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="q3" fill="#ec4899" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="q4" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 7: Stacked Bar Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-timeline" className="text-4xl text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">7. Stacked Bar Chart</h3>
                  <p className="text-sm text-gray-400">Lead sources breakdown</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateStackedBar()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="email" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="social" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="direct" stackId="a" fill="#10b981" />
                  <Bar dataKey="referral" stackId="a" fill="#eab308" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 8: Horizontal Bar Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-red-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:trophy" className="text-4xl text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold">8. Horizontal Bar Chart</h3>
                  <p className="text-sm text-gray-400">Top 10 Instagram leads</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={generateHorizontalBar()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {generateHorizontalBar().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.value >= 90
                            ? '#10b981'
                            : entry.value >= 80
                            ? '#3b82f6'
                            : entry.value >= 70
                            ? '#f59e0b'
                            : '#ef4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Section 1 Complete Badge */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 border border-red-500/30">
            <Icon icon="mdi:check-circle" className="text-8xl text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black mb-4">SECTION 1 COMPLETE</h3>
            <p className="text-xl text-red-100">8 Basic Cartesian Charts ✓</p>
          </div>
        </motion.div>
      </div>

      {/* ====================================================================
          SECTION 2: ADVANCED COMPOSITIONS (7 CHARTS)
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-orange-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-orange-500 font-bold text-sm uppercase tracking-wider">Section 2</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">
              Advanced Compositions
            </h2>
            <p className="text-xl text-gray-400">Complex multi-chart visualizations</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >

            {/* Chart 9: ComposedChart (Line + Bar) */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-box-plus-outline" className="text-4xl text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">9. ComposedChart (Line + Bar)</h3>
                  <p className="text-sm text-gray-400">Daily sales with running total</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={generateComposedData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="daily" fill="#f97316" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 10: ComposedChart (Area + Line) */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-areaspline-variant" className="text-4xl text-cyan-500" />
                <div>
                  <h3 className="text-2xl font-bold">10. ComposedChart (Area + Line)</h3>
                  <p className="text-sm text-gray-400">Response time range with average</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={generateResponseTimeData()}>
                  <defs>
                    <linearGradient id="rangeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="max" fill="url(#rangeGrad)" stroke="#06b6d4" />
                  <Area type="monotone" dataKey="min" fill="#000" stroke="none" />
                  <Line type="monotone" dataKey="avg" stroke="#eab308" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 11: Dual Y-Axis */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:axis-arrow" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">11. Dual Y-Axis Chart</h3>
                  <p className="text-sm text-gray-400">Revenue ($) vs Leads (#)</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={generateDualAxisData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 12: Scatter Plot */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-scatter-plot" className="text-4xl text-pink-500" />
                <div>
                  <h3 className="text-2xl font-bold">12. Scatter Plot</h3>
                  <p className="text-sm text-gray-400">Lead score vs conversion rate</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
<XAxis type="number" dataKey="x" name="Score" stroke="#9ca3af" />
<YAxis type="number" dataKey="y" name="Conversion" stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    cursor={{ strokeDasharray: '3 3' }}
                  />
                  <Scatter name="Leads" data={generateScatterData()} fill="#ec4899">
                    {generateScatterData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.score >= 80
                            ? '#10b981'
                            : entry.score >= 60
                            ? '#3b82f6'
                            : '#f59e0b'
                        }
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 13: Mixed Types */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-multiline" className="text-4xl text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">13. Mixed Types Chart</h3>
                  <p className="text-sm text-gray-400">Sales + Trend + Forecast</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={generateMixedChartData()}>
                  <defs>
                    <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="forecast" fill="url(#forecastGrad)" stroke="#8b5cf6" strokeWidth={2} />
                  <Bar dataKey="sales" fill="#eab308" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="trend" stroke="#10b981" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 14: Biaxial Line */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-line-variant" className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">14. Biaxial Line Chart</h3>
                  <p className="text-sm text-gray-400">Visits vs conversion rate</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateBiaxialData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#06b6d4" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ec4899" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="visits" stroke="#06b6d4" strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="rate" stroke="#ec4899" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 15: Reference Lines */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-red-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:target" className="text-4xl text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold">15. Targets & Actuals</h3>
                  <p className="text-sm text-gray-400">Quarterly performance vs goals</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={generateTargetData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="actual" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" />
                  <ReferenceLine y={90000} stroke="#10b981" strokeDasharray="3 3" label="Goal" />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Section 2 Complete Badge */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-orange-600 to-yellow-600 rounded-3xl p-12 border border-orange-500/30">
            <Icon icon="mdi:check-circle" className="text-8xl text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black mb-4">SECTION 2 COMPLETE</h3>
            <p className="text-xl text-orange-100">7 Advanced Composition Charts ✓</p>
          </div>
        </motion.div>
      </div>

      {/* ====================================================================
          SECTION 3: CIRCULAR & RADIAL CHARTS (6 CHARTS)
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-purple-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-purple-500 font-bold text-sm uppercase tracking-wider">Section 3</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">
              Circular & Radial Charts
            </h2>
            <p className="text-xl text-gray-400">Non-cartesian visualizations</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >

            {/* Chart 16: Simple Pie */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-pie" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">16. Simple Pie Chart</h3>
                  <p className="text-sm text-gray-400">Lead quality distribution</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={generatePieData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {generatePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 17: Donut Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-donut" className="text-4xl text-pink-500" />
                <div>
                  <h3 className="text-2xl font-bold">17. Donut Chart</h3>
                  <p className="text-sm text-gray-400">Traffic sources</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={generateDonutData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {generateDonutData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 18: Pie with Custom Labels */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-pie" className="text-4xl text-cyan-500" />
                <div>
                  <h3 className="text-2xl font-bold">18. Pie with Custom Labels</h3>
                  <p className="text-sm text-gray-400">Revenue by product</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={generateCustomLabelPie()}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {generateCustomLabelPie().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 19: RadialBar Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-arc" className="text-4xl text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">19. RadialBar Chart</h3>
                  <p className="text-sm text-gray-400">Goal completion by department</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="10%"
                  outerRadius="80%"
                  data={generateRadialBarData()}
                  startAngle={180}
                  endAngle={0}
                >
<RadialBar
  minPointSize={15}  // Changed from minAngle
  label={{ position: 'insideStart', fill: '#fff' }}
  background
  clockWise
  dataKey="value"
/>
                  <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 20: Radar Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:radar" className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">20. Radar Chart</h3>
                  <p className="text-sm text-gray-400">Product comparison</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={generateRadarData()}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
                  <PolarRadiusAxis stroke="#9ca3af" />
                  <Radar name="Product A" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                  <Radar name="Product B" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Final Badge */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 border border-purple-500/30">
            <Icon icon="mdi:check-circle" className="text-8xl text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black mb-4">SECTION 3 COMPLETE</h3>
            <p className="text-xl text-purple-100">6 Circular & Radial Charts ✓</p>
            <div className="mt-8 pt-8 border-t border-purple-400/30">
              <p className="text-2xl font-bold text-white">20 CHARTS COMPLETE</p>
              <p className="text-sm text-purple-200 mt-2">Ready for next phase...</p>
            </div>
          </div>
        </motion.div>
      </div>


      {/* ====================================================================
          SECTION 4: SPECIALIZED CHARTS (6 CHARTS)
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-green-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-green-500 font-bold text-sm uppercase tracking-wider">Section 4</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">
              Specialized Charts
            </h2>
            <p className="text-xl text-gray-400">Advanced visualization types</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >

            {/* Chart 21: Treemap */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-tree" className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">21. Treemap</h3>
                  <p className="text-sm text-gray-400">Organization structure by headcount</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <Treemap
                  data={generateTreemapData()}
                  dataKey="size"
                  aspectRatio={4 / 3}
                  stroke="#fff"
                  fill="#8884d8"
                >
                  {generateTreemapData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Treemap>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 22: Funnel Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:filter-variant" className="text-4xl text-blue-500" />
                <div>
                  <h3 className="text-2xl font-bold">22. Funnel Chart</h3>
                  <p className="text-sm text-gray-400">Conversion pipeline stages</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={generateFunnelData()}
                    isAnimationActive
                  >
                    <LabelList position="right" fill="#fff" stroke="none" dataKey="stage" />
                    {generateFunnelData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 23: Custom Heatmap (using Scatter) */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:grid" className="text-4xl text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">23. Heatmap</h3>
                  <p className="text-sm text-gray-400">Activity by day and hour</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis
                    type="category"
                    dataKey="dayLabel"
                    name="Day"
                    stroke="#9ca3af"
                  />
                  <YAxis
                    type="category"
                    dataKey="hourLabel"
                    name="Hour"
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Scatter data={generateHeatmapData()} fill="#8884d8">
                    {generateHeatmapData().map((entry, index) => {
                      const intensity = entry.value;
                      const color =
                        intensity < 20
                          ? '#1e3a8a'
                          : intensity < 40
                          ? '#3b82f6'
                          : intensity < 60
                          ? '#f59e0b'
                          : intensity < 80
                          ? '#f97316'
                          : '#ef4444';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 24: Waterfall-style Composed Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:waterfall-chart" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">24. Waterfall Chart</h3>
                  <p className="text-sm text-gray-400">Budget flow visualization</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateWaterfallData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {generateWaterfallData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.type === 'start' || entry.type === 'total'
                            ? '#3b82f6'
                            : entry.value > 0
                            ? '#10b981'
                            : '#ef4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 25: Polar Area Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-donut-variant" className="text-4xl text-cyan-500" />
                <div>
                  <h3 className="text-2xl font-bold">25. Polar Area Chart</h3>
                  <p className="text-sm text-gray-400">Performance across dimensions</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={generateRadarData()}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" stroke="#9ca3af" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                  <Radar
                    name="Metrics"
                    dataKey="A"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 26: Multi-Series Pie (Half Donut) */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-arc" className="text-4xl text-pink-500" />
                <div>
                  <h3 className="text-2xl font-bold">26. Half Donut Chart</h3>
                  <p className="text-sm text-gray-400">Gauge-style visualization</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={generateDonutData()}
                    cx="50%"
                    cy="70%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={140}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {generateDonutData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Section 4 Complete Badge */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 border border-green-500/30">
            <Icon icon="mdi:check-circle" className="text-8xl text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black mb-4">SECTION 4 COMPLETE</h3>
            <p className="text-xl text-green-100">6 Specialized Charts ✓</p>
          </div>
        </motion.div>
      </div>

      {/* ====================================================================
          SECTION 5: INTERACTIVE FEATURES (14 CHARTS)
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-blue-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-blue-500 font-bold text-sm uppercase tracking-wider">Section 5</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">
              Interactive Features
            </h2>
            <p className="text-xl text-gray-400">Dynamic behaviors and user interactions</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >

            {/* Chart 27: Brush & Zoom */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:magnify-scan" className="text-4xl text-blue-500" />
                <div>
                  <h3 className="text-2xl font-bold">27. Brush & Zoom</h3>
                  <p className="text-sm text-gray-400">Navigate large time-series datasets</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateBrushData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} />
                  <Brush dataKey="month" height={30} stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 28: Synchronized Charts */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:sync" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">28. Synchronized Charts</h3>
                  <p className="text-sm text-gray-400">Hover coordinated across multiple charts</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateSyncData()} syncId="sync1">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
                
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generateSyncData()} syncId="sync1">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="leads" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Chart 29: Active Pie (Interactive) */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:cursor-pointer" className="text-4xl text-pink-500" />
                <div>
                  <h3 className="text-2xl font-bold">29. Active Pie Chart</h3>
                  <p className="text-sm text-gray-400">Interactive slice expansion on hover</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    data={generatePieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                  >
                    {generatePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 30: Live Data Update */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:pulse" className="text-4xl text-cyan-500" />
                <div>
                  <h3 className="text-2xl font-bold">30. Live Data Stream</h3>
                  <p className="text-sm text-gray-400">Real-time updating (2s interval)</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={liveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 31: Legend Toggle Filter */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:filter" className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">31. Interactive Legend</h3>
                  <p className="text-sm text-gray-400">Click legend to toggle data series</p>
                </div>
              </div>

              <div className="mb-4 flex gap-4">
               {Object.keys(showLegend).map((key) => (
  <button
    key={key}
    onClick={() => setShowLegend({ ...showLegend, [key]: !showLegend[key as keyof typeof showLegend] })}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      showLegend[key as keyof typeof showLegend]
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMultiLineData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  {showLegend.revenue && (
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                  )}
                  {showLegend.costs && (
                    <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} />
                  )}
                  {showLegend.profit && (
                    <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 32: Reference Area Highlighting */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:selection-marker" className="text-4xl text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">32. Reference Area Zones</h3>
                  <p className="text-sm text-gray-400">Performance zones visualization</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceArea y1={0} y2={20000} fill="#ef4444" fillOpacity={0.1} label="Low" />
                  <ReferenceArea y1={20000} y2={35000} fill="#f59e0b" fillOpacity={0.1} label="Medium" />
                  <ReferenceArea y1={35000} y2={60000} fill="#10b981" fillOpacity={0.1} label="High" />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 33: Multi-Level Drill Down Visualization */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:layers-triple" className="text-4xl text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">33. Regional Analysis</h3>
                  <p className="text-sm text-gray-400">Geographic revenue breakdown</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateDrillDownData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
{generateDrillDownData().map((_, index) => (
  <Cell
    key={`cell-${index}`}
    fill={['#3b82f6', '#10b981', '#f59e0b', '#ec4899'][index % 4]}
  />
))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 34: Custom Tooltip with Rich Content */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-red-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:tooltip-text" className="text-4xl text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold">34. Rich Custom Tooltip</h3>
                  <p className="text-sm text-gray-400">Enhanced hover information</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateCategoryData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gradient-to-br from-red-600 to-orange-600 p-4 rounded-xl border-2 border-red-400 shadow-2xl">
                            <p className="text-white font-bold text-lg mb-2">
                              {payload[0].payload.name}
                            </p>
                            <p className="text-red-100 text-sm">
                              Revenue: <span className="font-bold">${payload[0].value?.toLocaleString()}</span>
                            </p>
                            <div className="mt-2 pt-2 border-t border-red-400/30">
                              <p className="text-xs text-red-200">
                                🔥 Performance Metric
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 35: Animated Entry */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:animation" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">35. Animated Bar Race</h3>
                  <p className="text-sm text-gray-400">Smooth animation on load</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateHorizontalBar()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 8, 8, 0]}
                    animationDuration={2000}
                    animationEasing="ease-out"
                  >
                    {generateHorizontalBar().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#8b5cf6" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 36: Stacked with Percentage */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:percent" className="text-4xl text-cyan-500" />
                <div>
                  <h3 className="text-2xl font-bold">36. Percentage Stacked Bar</h3>
                  <p className="text-sm text-gray-400">Normalized to 100%</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateStackedBar()} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    formatter={(value: any) => `${(value * 100).toFixed(1)}%`}
                  />
                  <Legend />
                  <Bar dataKey="email" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="social" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="direct" stackId="a" fill="#10b981" />
                  <Bar dataKey="referral" stackId="a" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 37: Multi-Axis Comparison */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-multiple" className="text-4xl text-pink-500" />
                <div>
                  <h3 className="text-2xl font-bold">37. Triple Metric Dashboard</h3>
                  <p className="text-sm text-gray-400">Revenue, volume, and efficiency</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={generateSyncData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#ec4899" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#ec4899" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 38: Gradient Bars */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:gradient-vertical" className="text-4xl text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">38. Gradient Fill Bars</h3>
                  <p className="text-sm text-gray-400">Beautiful gradient styling</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateCategoryData()}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 39: Negative Values */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-waterfall" className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">39. Profit & Loss Chart</h3>
                  <p className="text-sm text-gray-400">Positive and negative values</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateWaterfallData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceLine y={0} stroke="#ffffff" strokeWidth={2} />
                  <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                    {generateWaterfallData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 40: Bi-Directional Bar */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:arrow-left-right" className="text-4xl text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">40. Comparison Bar Chart</h3>
                  <p className="text-sm text-gray-400">Back-to-back comparison</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateGroupedBar()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="q1" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="q3" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Section 5 Complete Badge */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 border border-blue-500/30">
            <Icon icon="mdi:check-circle" className="text-8xl text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black mb-4">SECTION 5 COMPLETE</h3>
            <p className="text-xl text-blue-100">14 Interactive Feature Charts ✓</p>
            <div className="mt-8 pt-8 border-t border-blue-400/30">
              <p className="text-2xl font-bold text-white">40 CHARTS COMPLETE</p>
              <p className="text-sm text-blue-200 mt-2">2/3 of the showcase done!</p>
            </div>
          </div>
        </motion.div>
      </div>


      {/* ====================================================================
          SECTION 6: STYLING & THEMING (8 CHARTS)
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-pink-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-pink-500 font-bold text-sm uppercase tracking-wider">Section 6</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">
              Styling & Theming
            </h2>
            <p className="text-xl text-gray-400">Visual customization showcase</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >

            {/* Chart 41: Multi-Gradient Area */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-pink-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:gradient-horizontal" className="text-4xl text-pink-500" />
                <div>
                  <h3 className="text-2xl font-bold">41. Multi-Gradient Stacked Area</h3>
                  <p className="text-sm text-gray-400">Beautiful layered gradients</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generateStackedArea()}>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    </linearGradient>
                    <linearGradient id="grad3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="desktop" stackId="1" stroke="#ec4899" fill="url(#grad1)" />
                  <Area type="monotone" dataKey="mobile" stackId="1" stroke="#8b5cf6" fill="url(#grad2)" />
                  <Area type="monotone" dataKey="tablet" stackId="1" stroke="#3b82f6" fill="url(#grad3)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 42: Neon Glow Effect */}
            <motion.div
              variants={itemVariants}
              className="bg-black/80 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/30 hover:border-cyan-500/60 transition-colors"
              style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:lightbulb-on" className="text-4xl text-cyan-400" />
                <div>
                  <h3 className="text-2xl font-bold text-cyan-100">42. Neon Glow Chart</h3>
                  <p className="text-sm text-cyan-300">Cyberpunk aesthetic</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#06b6d430" />
                  <XAxis dataKey="date" stroke="#06b6d4" />
                  <YAxis stroke="#06b6d4" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#000',
                      border: '2px solid #06b6d4',
                      borderRadius: '8px',
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    filter="url(#glow)"
                    dot={{ fill: '#06b6d4', r: 6, filter: 'url(#glow)' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 43: Minimal Clean Design */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-gray-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:circle-outline" className="text-4xl text-gray-400" />
                <div>
                  <h3 className="text-2xl font-bold">43. Minimal Design</h3>
                  <p className="text-sm text-gray-400">Clean, professional simplicity</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateUserGrowth()}>
                  <XAxis dataKey="date" stroke="#6b7280" axisLine={false} tickLine={false} />
                  <YAxis stroke="#6b7280" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      color: '#000',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 44: Dark Theme Optimized */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-900 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:theme-light-dark" className="text-4xl text-gray-300" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-100">44. Dark Theme Chart</h3>
                  <p className="text-sm text-gray-400">Optimized for dark mode</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateCategoryData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                    }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 45: Gradient Stroke Line */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:format-color-fill" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">45. Rainbow Gradient Line</h3>
                  <p className="text-sm text-gray-400">Multi-color stroke effect</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateUserGrowth()}>
                  <defs>
                    <linearGradient id="rainbowGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="20%" stopColor="#f97316" />
                      <stop offset="40%" stopColor="#eab308" />
                      <stop offset="60%" stopColor="#10b981" />
                      <stop offset="80%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#rainbowGrad)"
                    strokeWidth={4}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 46: Glass Morphism */}
            <motion.div
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/30 transition-colors"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:blur" className="text-4xl text-white" />
                <div>
                  <h3 className="text-2xl font-bold">46. Glassmorphism Chart</h3>
                  <p className="text-sm text-gray-300">Frosted glass effect</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generateUserGrowth()}>
                  <defs>
                    <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                  <XAxis dataKey="date" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#fff"
                    strokeWidth={2}
                    fill="url(#glassGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 47: Retro Style */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-purple-900 to-pink-900 backdrop-blur-sm rounded-3xl p-8 border border-pink-500/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:television-classic" className="text-4xl text-pink-300" />
                <div>
                  <h3 className="text-2xl font-bold text-pink-100">47. Retro Wave Style</h3>
                  <p className="text-sm text-pink-200">80s synthwave aesthetic</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ec489950" />
                  <XAxis dataKey="date" stroke="#f472b6" />
                  <YAxis stroke="#f472b6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#831843',
                      border: '2px solid #ec4899',
                      borderRadius: '0',
                      color: '#fce7f3',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={{ fill: '#ec4899', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 48: Ferrari Branded */}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-red-900 to-black backdrop-blur-sm rounded-3xl p-8 border border-red-500"
              style={{ boxShadow: '0 0 60px rgba(239, 68, 68, 0.4)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:car-sports" className="text-4xl text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold text-red-100">48. Ferrari Signature Style</h3>
                  <p className="text-sm text-red-200">Ultimate racing aesthetics</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generateUserGrowth()}>
                  <defs>
                    <linearGradient id="ferrariGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop offset="50%" stopColor="#f97316" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#eab308" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ef444440" />
                  <XAxis dataKey="date" stroke="#fca5a5" />
                  <YAxis stroke="#fca5a5" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#7f1d1d',
                      border: '2px solid #ef4444',
                      borderRadius: '12px',
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fill="url(#ferrariGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Section 6 Complete Badge */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-12 border border-pink-500/30">
            <Icon icon="mdi:check-circle" className="text-8xl text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black mb-4">SECTION 6 COMPLETE</h3>
            <p className="text-xl text-pink-100">8 Styling & Theming Charts ✓</p>
          </div>
        </motion.div>
      </div>

      {/* ====================================================================
          SECTION 7: ANNOTATIONS & REFERENCES (6 CHARTS)
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-cyan-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-cyan-500 font-bold text-sm uppercase tracking-wider">Section 7</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">
              Annotations & References
            </h2>
            <p className="text-xl text-gray-400">Adding context to data</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >

            {/* Chart 49: Horizontal Reference Line */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:arrow-right" className="text-4xl text-cyan-500" />
                <div>
                  <h3 className="text-2xl font-bold">49. Target Line</h3>
                  <p className="text-sm text-gray-400">Horizontal threshold marker</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceLine
                    y={35000}
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: 'Target: $35K', position: 'right', fill: '#10b981' }}
                  />
                  <ReferenceLine
                    y={25000}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    label={{ value: 'Warning', position: 'right', fill: '#f59e0b' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 50: Vertical Event Markers */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:calendar-star" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">50. Event Timeline</h3>
                  <p className="text-sm text-gray-400">Mark important dates</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceLine
                    x="Mar"
                    stroke="#ec4899"
                    strokeWidth={2}
                    label={{ value: 'Product Launch', position: 'top', fill: '#ec4899' }}
                  />
                  <ReferenceLine
                    x="Sep"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    label={{ value: 'Q3 Review', position: 'top', fill: '#8b5cf6' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 51: Multiple Reference Areas */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:select-group" className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">51. Performance Zones</h3>
                  <p className="text-sm text-gray-400">Color-coded regions</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceArea y1={0} y2={20000} fill="#ef4444" fillOpacity={0.1} />
                  <ReferenceArea y1={20000} y2={35000} fill="#f59e0b" fillOpacity={0.1} />
                  <ReferenceArea y1={35000} fill="#10b981" fillOpacity={0.1} />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 52: Time Period Highlighting */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:timeline-clock" className="text-4xl text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">52. Period Highlighting</h3>
                  <p className="text-sm text-gray-400">Highlight specific time ranges</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <ReferenceArea x1="Apr" x2="Jun" fill="#8b5cf6" fillOpacity={0.2} label="Q2" />
                  <ReferenceArea x1="Oct" x2="Dec" fill="#ec4899" fillOpacity={0.2} label="Q4" />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 53: Peak/Valley Annotations */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:mountain" className="text-4xl text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">53. Peak Markers</h3>
                  <p className="text-sm text-gray-400">Highlight data extremes</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateMonthlyRevenue()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#eab308"
                    strokeWidth={3}
                    dot={(props: any) => {
                      const { cx, cy, payload } = props;
                      if (payload.value > 40000) {
                        return (
                          <g>
                            <circle cx={cx} cy={cy} r={6} fill="#10b981" stroke="#fff" strokeWidth={2} />
                            <text x={cx} y={cy - 15} textAnchor="middle" fill="#10b981" fontSize={12}>
                              ⭐
                            </text>
                          </g>
                        );
                      }
                      return <circle cx={cx} cy={cy} r={4} fill="#eab308" />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 54: Multi-Metric Labels */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-red-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:label-multiple" className="text-4xl text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold">54. Data Labels</h3>
                  <p className="text-sm text-gray-400">Direct value annotations</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateCategoryData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]}>
                    <LabelList dataKey="value" position="top" formatter={(value: number) => `$${(value/1000).toFixed(0)}K`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Section 7 Complete Badge */}
      <div className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-12 border border-cyan-500/30">
            <Icon icon="mdi:check-circle" className="text-8xl text-white mb-6 mx-auto" />
            <h3 className="text-4xl font-black mb-4">SECTION 7 COMPLETE</h3>
            <p className="text-xl text-cyan-100">6 Annotation Charts ✓</p>
          </div>
        </motion.div>
      </div>

      {/* ====================================================================
          SECTION 8: OSLIRA USE CASES (6 CHARTS)
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-yellow-950/10 to-black">
        <div className="max-w-7xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Section 8</span>
            <h2 className="text-5xl md:text-6xl font-black mt-4 mb-6">
              Oslira Use Cases
            </h2>
            <p className="text-xl text-gray-400">Real CRM analytics scenarios</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >

            {/* Chart 55: Lead Score Distribution */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-yellow-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:instagram" className="text-4xl text-yellow-500" />
                <div>
                  <h3 className="text-2xl font-bold">55. Lead Quality Breakdown</h3>
                  <p className="text-sm text-gray-400">Instagram profile scoring</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={generateLeadScoreDistribution()}
                    cx="50%"
                    cy="50%"
                    labelLine
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {generateLeadScoreDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 56: Engagement Trend with Brush */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-green-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:chart-timeline-variant" className="text-4xl text-green-500" />
                <div>
                  <h3 className="text-2xl font-bold">56. Engagement Trend</h3>
                  <p className="text-sm text-gray-400">6-month analysis performance</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generateEngagementTrend()}>
                  <defs>
                    <linearGradient id="engageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="cumulative" stroke="#10b981" fill="url(#engageGrad)" />
                  <Brush dataKey="month" height={30} stroke="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 57: Conversion Funnel */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-blue-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:filter-variant" className="text-4xl text-blue-500" />
                <div>
                  <h3 className="text-2xl font-bold">57. Conversion Pipeline</h3>
                  <p className="text-sm text-gray-400">Lead journey stages</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel
                    dataKey="value"
                    data={generateOsliraFunnel()}
                    isAnimationActive
                  >
                    <LabelList
                      position="right"
                      fill="#fff"
                      stroke="none"
                      dataKey="stage"
                    />
                    {generateOsliraFunnel().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 58: Top Instagram Leads */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:trophy" className="text-4xl text-purple-500" />
                <div>
                  <h3 className="text-2xl font-bold">58. Top 10 Leads</h3>
                  <p className="text-sm text-gray-400">Highest scoring Instagram profiles</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={generateTopInstagramLeads()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" stroke="#9ca3af" width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                    {generateTopInstagramLeads().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.score >= 95
                            ? '#10b981'
                            : entry.score >= 85
                            ? '#3b82f6'
                            : entry.score >= 75
                            ? '#f59e0b'
                            : '#ef4444'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 59: Monthly Performance */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:finance" className="text-4xl text-orange-500" />
                <div>
                  <h3 className="text-2xl font-bold">59. Revenue & Volume</h3>
                  <p className="text-sm text-gray-400">Monthly analysis performance</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={generateMonthlyPerformance()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#10b981" />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="analyses" stroke="#3b82f6" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Chart 60: Credit Usage Stacked Area */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-red-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <Icon icon="mdi:credit-card" className="text-4xl text-red-500" />
                <div>
                  <h3 className="text-2xl font-bold">60. Credit Consumption</h3>
                  <p className="text-sm text-gray-400">Usage by analysis type</p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generateCreditUsage()}>
                  <defs>
                    <linearGradient id="lightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="deepGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="premiumGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="lightAnalysis" stackId="1" stroke="#3b82f6" fill="url(#lightGrad)" />
                  <Area type="monotone" dataKey="deepAnalysis" stackId="1" stroke="#8b5cf6" fill="url(#deepGrad)" />
                  <Area type="monotone" dataKey="premiumFeatures" stackId="1" stroke="#ec4899" fill="url(#premiumGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ====================================================================
          FINAL VICTORY SECTION
      ==================================================================== */}
      <section className="py-32 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 rounded-3xl p-16 border-4 border-yellow-400 relative overflow-hidden">
            
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                background: [
                  'radial-gradient(circle at 0% 0%, #ef4444 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 100%, #f97316 0%, transparent 50%)',
                  'radial-gradient(circle at 0% 100%, #eab308 0%, transparent 50%)',
                  'radial-gradient(circle at 100% 0%, #ef4444 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="relative z-10">
              <motion.div
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Icon icon="mdi:car-sports" className="text-9xl text-white mb-8 mx-auto drop-shadow-2xl" />
              </motion.div>

              <h2 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-lg">
                🏁 SHOWCASE COMPLETE 🏁
              </h2>

              <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <p className="text-5xl font-black text-yellow-300 mb-4">60/60 CHARTS</p>
                <p className="text-2xl text-white font-bold">The Ultimate Recharts Reference</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { num: '8', label: 'Basic Cartesian', icon: 'mdi:chart-line' },
                  { num: '7', label: 'Advanced', icon: 'mdi:chart-box-plus-outline' },
                  { num: '6', label: 'Circular', icon: 'mdi:chart-pie' },
                  { num: '6', label: 'Specialized', icon: 'mdi:chart-tree' },
                  { num: '14', label: 'Interactive', icon: 'mdi:cursor-pointer' },
                  { num: '8', label: 'Styling', icon: 'mdi:palette' },
                  { num: '6', label: 'Annotations', icon: 'mdi:target' },
                  { num: '6', label: 'Oslira', icon: 'mdi:instagram' },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Icon icon={stat.icon} className="text-4xl text-yellow-300 mb-2 mx-auto" />
                    <p className="text-3xl font-black text-white">{stat.num}</p>
                    <p className="text-xs text-yellow-200">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-xl text-yellow-100">
                  ✨ Every Recharts Feature Demonstrated
                </p>
                <p className="text-xl text-yellow-100">
                  🎨 8 Unique Visual Styles
                </p>
                <p className="text-xl text-yellow-100">
                  🚀 Production-Ready Code
                </p>
                <p className="text-xl text-yellow-100">
                  🏎️ Ferrari-Level Performance
                </p>
              </div>

              <motion.div
                className="mt-12"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-6xl">🏆</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

        
    </div>
  );
}
