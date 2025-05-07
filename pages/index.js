export default function Home() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "sans-serif",
      flexDirection: "column",
      textAlign: "center"
    }}>
      <h1>مرحبًا بك في دالي بوت</h1>
      <p>الـ API تعمل بنجاح!</p>
      <p>جرب الروابط:</p>
      <ul>
        <li>
          <a href="/api/random?type=Bot">رد عشوائي من Bot</a>
        </li>
        <li>
          <a href="/api/random?type=Questions">رد عشوائي من Questions</a>
        </li>
      </ul>
    </div>
  );
}
