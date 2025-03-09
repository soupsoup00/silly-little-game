let images = []
let turn = 0

function getBase64FromPath(imagePath, callback) {
    fetch(imagePath)
        .then(response => response.blob()) // Convert to Blob
        .then(blob => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); // Read Blob as Data URL
            reader.onloadend = function () {
                const dataURL = reader.result;
                const base64 = dataURL.split(',')[1]; // Extract Base64 part
                callback(base64);
            };
        })
        .catch(error => console.error('Error loading image:', error));
}
const apiKey = ""; 
  async function askOpenAI(base64Image) {
    
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4o",
            max_tokens: 500,
            messages: [
                { "role": "user", "content": [
                    { "type": "text", "text": "What is in this image? The image will always be drawn in black and white so ignore this aspect while evaluating the image. Only give one option of what the image is. Only respond with what the image is." },
                    { "type": "image_url", "image_url": { "url": base64Image } }
                ]}
            ]
        })
    });

    const data = await response.json();
    console.log(data);
    
    images[turn] = data.choices[0].message.content
    if(turn % 2 == 0){
        document.getElementById("player1").innerHTML = images[turn]
    }
    else{
        document.getElementById("player2").innerHTML = images[turn]
    }
    console.log(images[turn])
}

async function compareInFight(entity1, entity2) {
    const prompt = `Compare how ${entity1} and ${entity2} would match up in a fight. Ignore the style of the image and focus on what the object is and do not acknowledge the style of drawing in the response. These entities may or may not be inanimate or unable to fight, be creative to guess how they would fight if they could. Who would win and why? Keep it to 1 paragraph maximum. Always end your response with "So the winner is player [NUMBER OF WINNING INPUT HERE]`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Use "gpt-3.5-turbo" if GPT-4 is not available
                messages: [
                    { role: "system", content: "You are a creative assistant who compares two entities in a hypothetical fight. You always choose a winner." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 300 // Adjust based on how long you want the response to be
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const result = data.choices[0].message.content;
        document.getElementById("big paragraph").innerHTML = result;

        //To count wins for each player
        const last2 = result.charAt(result.length - 2);
        // console.log(last2);
        incrementNumber(last2);

        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

async function resizeAndCompressBase64(base64Str) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const targetSize = 512;
            canvas.width = targetSize;
            canvas.height = targetSize;

            // Draw the image to resize it
            ctx.drawImage(img, 0, 0, targetSize, targetSize);

            // Convert to JPEG with 70% quality
            resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = reject;
    });
}


async function doneDrawing(){
    let canvas64 = await canvasTo64()
    let base64_img = await resizeAndCompressBase64(canvas64)
    console.log(base64_img)
    await askOpenAI(base64_img)
    turn++;
    if(turn>1){
        if(turn % 2 == 0){
            console.log(await compareInFight(images[turn - 2], images[turn - 1]))
        }
        else{
            console.log(await compareInFight(images[turn - 1], images[turn - 2]))
        }
    }
    toggle();
    resetCanvas();
}
