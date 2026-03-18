export const formatBytes = (value?: number) => {
  if (value == null || Number.isNaN(value)) return "-";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unit = 0;

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }

  const decimals = size >= 10 ? 1 : 2;
  return `${size.toFixed(decimals)} ${units[unit]}`;
};

export const formatContext = (value?: number) => {
  if (value == null || Number.isNaN(value)) return "-";
  return `${value.toLocaleString()} tokens`;
};

export const formatCapability = (value?: boolean) => (value ? "Yes" : "No");
