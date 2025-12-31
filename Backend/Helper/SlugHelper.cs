using System.Text.RegularExpressions;
using System.Globalization;
using System.Text;
namespace Ecommerce.Helper
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string input)
        {
            if(string.IsNullOrWhiteSpace(input))
            {
                return string.Empty;
            }
            input = input.ToLowerInvariant();

            input = input.Replace("đ", "d");

            input = RemoveDiacritics(input);

            input = Regex.Replace(input, @"[^a-z0-9\s-]", "");

            input = Regex.Replace(input, @"\s+", "-").Trim('-');

            return input;
        }
        private static string RemoveDiacritics(string text)
        {
            var normalized = text.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();

            foreach (var c in normalized)
            {
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                {
                    sb.Append(c);
                }
            }

            return sb.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
