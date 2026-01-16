export default function FormattedDate({
    value,
    emptyText = "Chưa cập nhật",
    locale = "vi-VN",
  }) {
    if (!value) return <span>{emptyText}</span>;
  
    const date = new Date(value);
  
    if (date.getFullYear() <= 1) {
      return <span>{emptyText}</span>;
    }
  
    return (
      <span>
        {date.toLocaleDateString(locale)}
      </span>
    );
  }
  