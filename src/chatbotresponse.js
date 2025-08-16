
async function updateDiv(input) {
    console.log("Updating div with chatbot response...");
    const request = new Request("/sendPrompt", {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    fetch(request).then((response) => {
        if(response.status === 200) {
            return response.text();
        } else {
            console.log("Fetch error");
        }
        })
    .then(text => {
        console.log("RESPONSE TEXT: " + text)
        document.getElementById("airesult").innerHTML = text;
    });        

}

var aiButton = document.getElementById("aisubmit");
aiButton.addEventListener("click", (event) => { 
    event.preventDefault();
    var input = document.getElementById("aiprompt");
    var inputValue = input.value;
    console.log(inputValue);
    updateDiv(inputValue);

});