import { AppHeader } from "@/components/Layout/AppHeader";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getDomainLabel } from "@/lib/domains";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3, Target, TrendingUp, BookOpen, Star, Brain } from "lucide-react";
import { fadeUp, staggerContainer, staggerItem, transitions } from "@/lib/animations";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend,
} from "recharts";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(168, 80%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(30, 90%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(340, 70%, 55%)",
  "hsl(120, 50%, 45%)",
];

const Analytics = () => {
  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="animate-pulse space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-secondary rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!data) return null;

  const radarData = data.domainStats.map((d) => ({
    domain: getDomainLabel(d.domain).split(" ")[0],
    interactions: d.interactions,
    accuracy: d.accuracy,
    rating: d.avgRating * 20, // scale to 100
  }));

  const pieData = data.domainStats.map((d) => ({
    name: getDomainLabel(d.domain),
    value: d.interactions,
  }));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1">Learning Analytics</h1>
          <p className="text-muted-foreground mb-8">Your personalized performance insights across all domains</p>
        </motion.div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Sessions", value: data.totalInteractions, icon: BookOpen, color: "text-primary" },
            { label: "Quiz Accuracy", value: `${data.overallAccuracy}%`, icon: Target, color: "text-emerald-500" },
            { label: "Avg Rating", value: `${data.overallRating}/5`, icon: Star, color: "text-amber-500" },
            { label: "Active Domains", value: data.activeDomains, icon: Brain, color: "text-violet-500" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Daily Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Activity (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="interactions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Domain Distribution Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" /> Domain Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">No data yet — start learning!</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Per-domain accuracy bar chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" /> Quiz Accuracy by Domain
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.domainStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.domainStats.map((d) => ({ name: getDomainLabel(d.domain).split(" ")[0], accuracy: d.accuracy, attempts: d.quizAttempts }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="accuracy" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">Take quizzes to see accuracy</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Radar chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-violet-500" /> Skill Radar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {radarData.length > 1 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                      <PolarRadiusAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                      <Radar name="Interactions" dataKey="interactions" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                      <Radar name="Accuracy" dataKey="accuracy" stroke="hsl(168, 80%, 50%)" fill="hsl(168, 80%, 50%)" fillOpacity={0.15} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">Learn in 2+ domains to see radar</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Per-domain breakdown table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Domain Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {data.domainStats.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left py-2 font-medium">Domain</th>
                        <th className="text-center py-2 font-medium">Sessions</th>
                        <th className="text-center py-2 font-medium">Quizzes</th>
                        <th className="text-center py-2 font-medium">Accuracy</th>
                        <th className="text-center py-2 font-medium">Avg Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.domainStats.map((d) => (
                        <tr key={d.domain} className="border-b border-border/50">
                          <td className="py-2 font-medium text-foreground">{getDomainLabel(d.domain)}</td>
                          <td className="py-2 text-center text-foreground">{d.interactions}</td>
                          <td className="py-2 text-center text-foreground">{d.quizAttempts}</td>
                          <td className="py-2 text-center">
                            <span className={`font-medium ${d.accuracy >= 70 ? "text-emerald-500" : d.accuracy >= 40 ? "text-amber-500" : "text-destructive"}`}>
                              {d.accuracy}%
                            </span>
                          </td>
                          <td className="py-2 text-center text-foreground">{d.avgRating || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-4 text-center">Start learning to see your domain breakdown</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;
