import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ClientPlan } from "./types";
import { formatCurrency, formatDate } from "./format";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937" },
  title: { fontSize: 18, fontWeight: 700, marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#6b7280", marginBottom: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 16,
    marginBottom: 6,
    textTransform: "uppercase",
    color: "#4338ca",
  },
  row: { flexDirection: "row", marginBottom: 4 },
  statBox: { flex: 1 },
  statLabel: { fontSize: 8, color: "#6b7280" },
  statValue: { fontSize: 12, fontWeight: 700 },
  para: { marginBottom: 6, lineHeight: 1.4 },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  cardTitle: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  bullet: { fontSize: 9, marginBottom: 2 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 4,
    fontWeight: 700,
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    fontSize: 8,
  },
  col1: { flex: 2 },
  col2: { flex: 3 },
  col3: { flex: 1.5 },
  disclaimer: { fontSize: 7, color: "#9ca3af", marginBottom: 3, lineHeight: 1.3 },
});

export function ClientPlanPdf({ plan }: { plan: ClientPlan }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.title}>
          {plan.clientName ? `${plan.clientName} — Credit & Budget Plan` : "Credit & Budget Plan"}
        </Text>
        <Text style={styles.subtitle}>Generated {formatDate(plan.generatedDate)}</Text>

        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Current score estimate</Text>
            <Text style={styles.statValue}>{plan.currentScoreEstimate.range}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Target increase</Text>
            <Text style={styles.statValue}>
              +{plan.targetScoreIncrease} pts / {plan.targetTimeframeMonths} mo
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Monthly cash flow</Text>
            <Text style={styles.statValue}>{formatCurrency(plan.monthlyCashFlow)}</Text>
          </View>
        </View>
        <Text style={styles.para}>{plan.executiveSummary}</Text>

        <Text style={styles.sectionTitle}>Credit factors</Text>
        {plan.creditFactors.map((f) => (
          <View key={f.factor} style={styles.card}>
            <Text style={styles.cardTitle}>
              {f.factor.replace(/_/g, " ")} — {f.rating}
            </Text>
            <Text style={styles.bullet}>{f.currentState}</Text>
            {f.actionsToImprove.map((a, i) => (
              <Text key={i} style={styles.bullet}>
                • {a}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Negative items</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Creditor</Text>
          <Text style={styles.col2}>Issue / Strategy</Text>
          <Text style={styles.col3}>Priority</Text>
        </View>
        {plan.negativeItems.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.col1}>{item.creditor}</Text>
            <Text style={styles.col2}>
              {item.description} — {item.recommendedStrategy.replace(/_/g, " ")}
            </Text>
            <Text style={styles.col3}>{item.priority}</Text>
          </View>
        ))}
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>Monthly budget</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.col1}>Category</Text>
          <Text style={styles.col3}>Type</Text>
          <Text style={styles.col3}>Monthly</Text>
        </View>
        {plan.budgetCategories.map((c, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.col1}>{c.category}</Text>
            <Text style={styles.col3}>{c.type.replace(/_/g, " ")}</Text>
            <Text style={styles.col3}>{formatCurrency(c.monthlyAmount)}</Text>
          </View>
        ))}
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total income</Text>
            <Text style={styles.statValue}>{formatCurrency(plan.totalMonthlyIncome)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total expenses</Text>
            <Text style={styles.statValue}>{formatCurrency(plan.totalMonthlyExpenses)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Debt payoff plan ({plan.payoffStrategy})
        </Text>
        <Text style={styles.para}>{plan.payoffStrategyRationale}</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.col3}>#</Text>
          <Text style={styles.col1}>Creditor</Text>
          <Text style={styles.col3}>Balance</Text>
          <Text style={styles.col3}>Payment</Text>
        </View>
        {plan.debtPayoffPlan
          .slice()
          .sort((a, b) => a.payoffOrderRank - b.payoffOrderRank)
          .map((d) => (
            <View key={d.creditor} style={styles.tableRow}>
              <Text style={styles.col3}>{d.payoffOrderRank}</Text>
              <Text style={styles.col1}>{d.creditor}</Text>
              <Text style={styles.col3}>{formatCurrency(d.balance)}</Text>
              <Text style={styles.col3}>{formatCurrency(d.recommendedMonthlyPayment)}</Text>
            </View>
          ))}
      </Page>

      <Page size="LETTER" style={styles.page}>
        <Text style={styles.sectionTitle}>6-month action plan</Text>
        {plan.sixMonthPlan
          .slice()
          .sort((a, b) => a.month - b.month)
          .map((m) => (
            <View key={m.month} style={styles.card}>
              <Text style={styles.cardTitle}>
                Month {m.month}: {m.theme}
              </Text>
              {m.targetActions.map((a, i) => (
                <Text key={i} style={styles.bullet}>
                  • {a}
                </Text>
              ))}
              <Text style={styles.bullet}>Budget focus: {m.budgetFocus}</Text>
              <Text style={styles.bullet}>Expected milestone: {m.expectedMilestone}</Text>
            </View>
          ))}

        {plan.riskFlags.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Flags for advisor review</Text>
            {plan.riskFlags.map((f, i) => (
              <Text key={i} style={styles.bullet}>
                • {f}
              </Text>
            ))}
          </>
        )}

        <Text style={styles.sectionTitle}>Disclaimers</Text>
        {plan.disclaimers.map((d, i) => (
          <Text key={i} style={styles.disclaimer}>
            {d}
          </Text>
        ))}
      </Page>
    </Document>
  );
}
