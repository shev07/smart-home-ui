export const demoUsers = [
  {
    username: "admin",
    password: "admin123",
    phone: "0901234567",
    fullName: "Smart Home Admin"
  },
  {
    username: "khanh",
    password: "khanh123",
    phone: "0912345678",
    fullName: "Khanh Demo"
  }
];

export const updateDemoUserPassword = (username, nextPassword) => {
  const user = demoUsers.find((item) => item.username === username);

  if (!user) {
    return null;
  }

  user.password = nextPassword;
  return user;
};
