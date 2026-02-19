const RASA_URL =
	"https://stunning-trout-x5xrj9vqv9ww2vrv6-5005.app.github.dev/webhooks/rest/webhook";

export async function sendMessageToRasa(
	message: string,
	sender = "user1",
): Promise<string[]> {
	try {
		const res = await fetch(RASA_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sender, message }),
		});
		const data = await res.json();
		return data.map((item: any) => item.text || "");
	} catch (err) {
		console.error("Error enviando mensaje a Rasa:", err);
		return ["Error conectando con el bot"];
	}
}
