import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ClientPlan } from "./types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937" },
  banner: {
    backgroundColor: "#fef3c7",
    padding: 8,
    marginBottom: 16,
    fontSize: 8,
    color: "#92400e",
  },
  subject: { fontSize: 11, fontWeight: 700, marginBottom: 2 },
  recipient: { fontSize: 9, color: "#6b7280", marginBottom: 12 },
  body: { fontSize: 10, lineHeight: 1.5 },
});

export function LettersPdf({ plan }: { plan: ClientPlan }) {
  if (plan.letters.length === 0) {
    return (
      <Document>
        <Page size="LETTER" style={styles.page}>
          <Text>No letters were recommended for this client.</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {plan.letters.map((letter) => (
        <Page key={letter.id} size="LETTER" style={styles.page}>
          <View style={styles.banner}>
            <Text>
              DRAFT — for {plan.clientName || "the client"} to review, personalize with their
              own information, sign, and send themselves. This firm does not send this letter
              on the client&apos;s behalf.
            </Text>
          </View>
          <Text style={styles.subject}>{letter.subject}</Text>
          <Text style={styles.recipient}>To: {letter.recipient}</Text>
          <Text style={styles.body}>{letter.body}</Text>
        </Page>
      ))}
    </Document>
  );
}
