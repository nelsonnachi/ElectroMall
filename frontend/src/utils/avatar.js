const HEX_COLORS = [
  "#2563eb",
  "#059669",
  "#4f46e5",
  "#7c3aed",
  "#9333ea",
  "#db2777",
  "#e11d48",
  "#d97706",
];

export const hasCustomAvatar = (avatar) => {
  if (!avatar?.url) {
    return false;
  }

  if (avatar.public_id === "default_avatar") {
    return false;
  }

  return !avatar.url.includes("ui-avatars.com/api");
};

export const getAvatarStyle = (userObj) => {
  const userName = userObj?.name || "User";
  let characterSum = 0;

  for (const letter of userName) {
    characterSum += letter.charCodeAt(0);
  }

  const colorIndex = characterSum % HEX_COLORS.length;
  return { backgroundColor: HEX_COLORS[colorIndex] };
};

export const getUserInitial = (userObj) => {
  return userObj?.name ? userObj.name.charAt(0).toUpperCase() : "U";
};
