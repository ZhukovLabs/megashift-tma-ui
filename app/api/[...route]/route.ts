export const GET = async () => {

    const response = await fetch(process.env.SERVER!);

    return response;
}