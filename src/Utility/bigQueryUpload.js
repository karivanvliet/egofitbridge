async function bigQueryUpload(rows, accessToken) {
  console.log(rows);
  const response = await fetch('https://bigquery.googleapis.com/bigquery/v2/projects/egofitbridge/datasets/fit_data/tables/tm_data/insertAll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      insertId: new Date().toISOString(),
      ignoreUnknownValues: true,
      rows,
    }),
  });

  const data = await response.json();
  return data;
}

export default bigQueryUpload;
