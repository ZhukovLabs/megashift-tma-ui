export const formatMoney = (
    value: number,
    currencySymbol?: string
) => {
    return `${value.toLocaleString()} ${currencySymbol ?? ''}`.trim();
}