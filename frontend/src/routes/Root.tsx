import auth from "../config/firebase";

export default function Root() {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => auth.signOut()}>Sign out</button>
    </div>
  );
}
