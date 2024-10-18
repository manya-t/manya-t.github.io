function showOtherInput() {
    var fandom = document.getElementById("fandom");
    var otherInput = document.getElementById("other-input");

    // Show the text input if "Other" is selected, otherwise hide it
    if (fandom.value === "other") {
        otherInput.style.display = "block";
    } else {
        otherInput.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("myForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form from refreshing the page

        var dropdown = document.getElementById("fandom").value;
        var otherInput = document.getElementById("otherFandom").value;

        if (dropdown === "other") {
            var fandom_url = otherInput
        }
        else {
            var fandom_url = dropdown
        }

        var proxyUrl = 'https://api.codetabs.com/v1/proxy/?quest=';
        var resultDiv = document.getElementById("resultDiv")
        fetch(proxyUrl + fandom_url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text(); 
            })
            .then(data => {
                var parser = new DOMParser();
                var page1 = parser.parseFromString(data, 'text/html');

                var heading = page1.querySelector('h2').innerText;
                var startIndex = heading.indexOf("of") + 3
                var endIndex = heading.indexOf(" Works", startIndex)
                var numWorks = parseInt(heading.substring(startIndex,endIndex).trim().replace(/,/g, ""))

                var workNum = Math.floor(Math.random() * numWorks) //random num between 0 and numWorks inclusive
                var pageNum = Math.floor(workNum/20) + 1

                fetch(proxyUrl + fandom_url + "?page=" + pageNum)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text(); 
                })
                .then(data => {
                    var page = parser.parseFromString(data, 'text/html');
                    var fics = page.querySelectorAll('.work.blurb.group')
                    entry = fics[workNum % 20].innerHTML.replaceAll('href="/', 'href="https://archiveofourown.org/')
                    resultDiv.innerHTML = entry
                })
                .catch(error => {
                    resultDiv.innerHTML =  "Error fetching data: " + error.message;
                });

                
            })
            .catch(error => {
                resultDiv.innerHTML =  "Error fetching data: " + error.message;
            });

    })
})