export default function authHeader() {
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");

  if (username && token) {
    return { Authorization: "Bearer " + token };
  } else return {};
}
