export function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}
export const formatNGN = (value: number) =>
  `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;

export const formatNumberWithCommas = (value: number): string => {
  if (!value) return "";
  const numeric = value.toString().replace(/\D/g, "");
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const truncate = (text: string, charNumber: number) => {
  if ((text ?? "").length > charNumber) {
    return `${text.substring(0, charNumber - 3)}...`;
  }
  return text;
};

export const formatSize = (size: number) => {
  if (size < 1024) return `${size} bytes`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} kb`;
  return `${(size / (1024 * 1024)).toFixed(1)} mb`;
};
