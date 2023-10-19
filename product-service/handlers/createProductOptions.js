module.exports.createProductOptions = async (event) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
    body: JSON.stringify({ message: "CORS enabled" }),
  };
};
