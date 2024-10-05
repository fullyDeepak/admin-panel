export async function DocAttachTable({
  headers,
  data,
}: {
  headers: { label: string; filterType: 'TEXT' }[];
  data: Record<string, any>[];
}) {
  return (
    <table>
      <thead></thead>
      <tbody></tbody>
    </table>
  );
}
