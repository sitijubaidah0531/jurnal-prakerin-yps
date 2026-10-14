export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>Jurnal Prakerin Siti</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body style={{margin:0}}>{children}</body>
    </html>
  );
}
