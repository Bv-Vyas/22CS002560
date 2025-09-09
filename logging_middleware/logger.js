const axios = require("axios");

const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJiaGF3ZXNoLnZ5YXNAc3BzdS5hYy5pbiIsImV4cCI6MTc1NzQwMzAxNiwiaWF0IjoxNzU3NDAyMTE2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiYjVhNWNkOGItZGNmYS00NTYxLTlkNTEtODZiOWVjNzUzMjg1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYmhhd2VzaCB2eWFzIiwic3ViIjoiMTU4Y2E2MDMtNDZlMC00YWIxLWIwYzgtN2E1YmUyYWRjYzE1In0sImVtYWlsIjoiYmhhd2VzaC52eWFzQHNwc3UuYWMuaW4iLCJuYW1lIjoiYmhhd2VzaCB2eWFzIiwicm9sbE5vIjoiMjJjczAwMjU2MCIsImFjY2Vzc0NvZGUiOiJ0eXNoVVciLCJjbGllbnRJRCI6IjE1OGNhNjAzLTQ2ZTAtNGFiMS1iMGM4LTdhNWJlMmFkY2MxNSIsImNsaWVudFNlY3JldCI6ImVnSFpyTVpuZXlNWGpmdFEifQ.TsY9j6plKD0Lp2sG2SgKOjnmnGAe0tNyFRYX8NZV2jo";

async function Log(stack, level, pkg, message) {
  try {
    const payload = { stack, level, package: pkg, message };

    const response = await axios.post(LOG_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });

    console.log("Log sent successfully:", response.data);
  } catch (error) {
    console.error("Failed to send log:", error.message);
  }
}

module.exports = { Log };
