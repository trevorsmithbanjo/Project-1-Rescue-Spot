$(document).ready(function () {
    // Selector Variables
    var citySearch = $(".citySearch");
    var stateSearch = $(".stateSearch");
    var submitBtn = $("#submit-button");
    var dogInfo = $("#dog-info-container");

    // Global Variables
    // User search is the string from the city state submit form.
    var userSearch = "";


    // Petfinder API Keys
    var petfinderKey = "SQ6UnllCHsLaZRcQkfninVeneIproVkudasiqT8gBYdpYAF9BA";
    var petfinderSecret = "Z2E41aprwiJbwOKRbfbuWvMKBFUk6jqFTQ9B12NA";

    // Petfinder API Call function
    function petfinderCall() {
        var pf = new petfinder.Client({ apiKey: petfinderKey, secret: petfinderSecret });

        pf.animal.search({ location: userSearch })
            .then(function (response) {
                //// Original array to pull data. 
                animalsArr = response.data.animals;
                populateDogCards(animalsArr);
            })
            .catch(function (error) {
                // Handle the error
                console.log(error);
            });
    }


    // Initialization for dropdown states
    $("select").formSelect();

    // Submit Button event listener for City and State Search
    submitBtn.on("click", function (event) {
        event.preventDefault();
        var userCity = citySearch.val().trim();
        var userState = $("#states").val();

        // String to use for API call
        userSearch = userCity + ", " + userState;
        petfinderCall();
    })

    // Function to populate Dag Cards Info
    function populateDogCards(animalsArr) {
        dogInfo.empty();
        for (var i = 0; i < 5; i++) {
            name = animalsArr[i].name;
            age = animalsArr[i].age;
            breed = animalsArr[i].breeds.primary;
            gender = animalsArr[i].gender;
            url = animalsArr[i].url;
            description = animalsArr[i].description;;
            if (description === null) {
                description = "N/A"
            }
            spayedNeutered = animalsArr[i].attributes.spayed_neutered;
            if (spayedNeutered === true) {
                spayedNeutered = "Yes"
            }
            else {
                spayedNeutered = "No"
            }

            // Render photo
            var photo = animalsArr[i].primary_photo_cropped;
            if (photo !== null) {
                photoURL = photo.small;
                console.log("Photo URL: " + photoURL);
            }
            else {
                photoURL = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/488px-No-Image-Placeholder.svg.png";
                console.log("Photo URL: " + photoURL);
            }

            // Parse Contact info
            address = animalsArr[i].contact.address.address1;
            if (address == null) {
                address = "";
            }
            city = animalsArr[i].contact.address.city;
            state = animalsArr[i].contact.address.state;

            dogInfo.prepend(/*html*/`<div class="card horizontal dog-cards">
                                    <div id="dog-image" class="card-image">
                                        <img class="materialboxed" width="100" height="200"
                                            src=${photoURL}
                                            alt="picture of available dog">
                                    </div>
                                    <div id="dog-card" class="card-stacked">
                                         <div class="card-content">
                                            <p>Name: ${name}</p>
                                            <p>Age: ${age}</p>
                                            <p>Gender: ${gender}</p>
                                            <p>Spayed/Neutered: ${spayedNeutered}</p>
                                            <p>Location: <span>${address}</span><br>
                                                        <span>${city}</span><br>
                                                        <span>${state}</span>
                                            </p>
                                            <p>Description: ${description}</p>
                                        </div>
                                        <div class="card-action">
                                            <a href=${url}>See more!</a>
                                        </div>
                                    </div>
                                </div>
                                 <br>`);
        }
    }
})