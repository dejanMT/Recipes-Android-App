//========================================================================
//========================================================================
//Add page
//========================================================================
//========================================================================

function getDate(){
    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes();

    return time + ' ' + date;
}

function saveToLocalStorage(){
    var recipeName = document.getElementById("recipeName").value;
    var recipeDesc = document.getElementById("recipeDesc").value;
    var recipeType = document.getElementById("recipeType").value;

    var getRecipes = JSON.parse(localStorage.getItem("allRecipes"));

    if(getRecipes == null){
        getRecipes = [];
    }

    recipeDesc = recipeDesc.replaceAll("\n", "<br />\r\n");
    getRecipes.push({"RecipeName": recipeName, "RecipeDescription": recipeDesc, "RecipeType": recipeType, "RecipeAddedDate":getDate(),"RecipeImage": "", "favourite": false});
    localStorage.setItem("allRecipes", JSON.stringify(getRecipes));  

}

function presentAlertMultipleButtons(header, subHeader, message, button) {
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'my-custom-class';
    alert.header = header;
    alert.subHeader = subHeader;
    alert.message = message;
    alert.buttons = button;
  
    document.body.appendChild(alert);
    return alert.present();
}

function validateForm(){
    var recipeName = document.getElementById("recipeName").value;
    var recipeDesc = document.getElementById("recipeDesc").value;
    var recipeType = document.getElementById("recipeType").value;
    const alert = document.createElement('ion-alert');

    if(!recipeName || !recipeDesc || !recipeType){
        alert.cssClass = 'my-custom-class';
        alert.header = 'MyRecipes';
        alert.message = 'Please fill-in all fields';
        alert.buttons = ['OK'];
    } else {
        alert.cssClass = 'my-custom-class';
        alert.header = 'MyRecipes';
        alert.message = 'Are you sure you want to save this recipe?';

        alert.buttons = [
            {
              text: 'CANCEL',
              role: 'cancel'
            }, {
              text: 'OK',
              handler: () => {
                saveToLocalStorage('');
                location.href="index.html";
              }
            }
          ];

    }
    document.body.appendChild(alert);
    return alert.present();
}


//========================================================================
//========================================================================
//Home page
//========================================================================
//========================================================================

async function presentToast(message) {
    const toast = document.createElement('ion-toast');
    toast.message = message;
    toast.duration = 2000;
  
    document.body.appendChild(toast);
    return toast.present();
}

function deleteSingleRecipe(element){
    var getRecipes = JSON.parse(localStorage.getItem("allRecipes"));
    getRecipes.splice(element.id,1);
    localStorage.setItem("allRecipes", JSON.stringify(getRecipes));

    location.reload();
}

function deleteAllRecipes(){
    const alert = document.createElement('ion-alert');
    var getRecipes = JSON.parse(localStorage.getItem("allRecipes"));

    if(getRecipes == ""){
        presentToast('No recipes to clear!');
        console.log("no")
    } else {
        alert.cssClass = 'my-custom-class1';
        alert.header = 'Delete All Recipes';
        alert.message = 'Are you sure you want to delete all recipes?';
        console.log("yes")
        alert.buttons = [
            {
              text: 'NO',
              role: 'cancel'
            }, {
              text: 'YES',
              handler: () => {
                getRecipes = [];
                localStorage.setItem("allRecipes", JSON.stringify(getRecipes));
                presentToast('All recipes were cleard');
            
                document.getElementById("indexRecipes").innerHTML = "<h4 class='ion-text-center'>No recipes yet. Go on, add a new one!</h4>";
            }
            }
          ];

          document.body.appendChild(alert);
          return alert.present();
    }
}

function loadIconAccordingToMealType(mealType){
    if(mealType == "Breakfast"){
        return '<ion-icon name="cafe-outline"></ion-icon>';
    } else if (mealType == "Lunch"){
        return'<ion-icon name="pizza-outline"></ion-icon>';
    } else if(mealType == "Dinner"){
        return '<ion-icon name="restaurant-outline"></ion-icon>';
    } else {
        return '<ion-icon name="beer-outline"></ion-icon>';
    }
}

function changeColorToStar(){
    var getRecipes = JSON.parse(localStorage.getItem("allRecipes"));

    for (let index = 0; index < getRecipes.length; index++) {
        parent = document.querySelector('.btnFavIcon'+index);
        children = parent.children[0]; 
       
        if(!getRecipes[index].favourite){
            children.name = 'star-outline';
            children.color = 'dark'
        } else {
            children.name = 'star';
            children.color = 'warning';
        } 
    }
}

function addToFavorite(element){
    var getRecipes = JSON.parse(localStorage.getItem("allRecipes"));

    if(getRecipes[element.id].favourite == true){
        getRecipes[element.id].favourite = false;
    } else {
        getRecipes[element.id].favourite = true;
    }

    localStorage.setItem("allRecipes", JSON.stringify(getRecipes)); 
    changeColorToStar();
}

var curImgPath = "";

function loadRecipes(){
    var getRecipes = JSON.parse(localStorage.getItem("allRecipes"));
    
    if(getRecipes == null || getRecipes == ""){
        document.getElementById("indexRecipes").innerHTML = "<h4 class='ion-text-center'>No recipes yet. Go on, add a new one!</h4>";
    } else{
        getRecipes.forEach((element, count) => {
            
            mealTypeIcon = loadIconAccordingToMealType(element.RecipeType)
            var recipeList = `
                <ion-card>
                <script>getIdFromEl(${count})</script>
                    <ion-card-header>
                        <ion-item lines="none" class="ion-no-padding">
                            <ion-card-title>${mealTypeIcon}∙${element.RecipeName}</ion-card-title>
                            <ion-buttons slot="end">
                                <ion-grid>
                                    <ion-row>
                                        <ion-col>
                                            <ion-button onclick="deleteSingleRecipe(this)" id="${count}">
                                                <ion-icon name="trash-outline"></ion-icon>                                
                                            </ion-button>
                                        </ion-col>

                                        <ion-col>
                                            <ion-button onclick="addToFavorite(this)" id="${count}" class="btnFavIcon${count}">
                                                <ion-icon name="star-outline" onclick="changeColorToStar(this)" id="${count}Icon" color=""></ion-icon>
                                            </ion-button>
                                        </ion-col>
                                    </ion-row>

                                    <ion-row>
                                        <ion-col>
                                            <ion-button id="trigger-button" onclick="presentModal(${count});">
                                                <ion-icon name="image-outline" onclick="onclick="saveIdToLocal(this);" id="${count}"></ion-icon>
                                            </ion-button>
                                        </ion-col>

                                        <ion-col>
                                            <ion-button onclick="getCamera(${count})">
                                                <ion-icon name="camera-outline"></ion-icon>
                                            </ion-button> 
                                        </ion-col>
                                    </ion-row>
                                </ion-grid>
                            </ion-buttons>
                        </ion-item>
                        
                        <ion-label>${element.RecipeAddedDate}</ion-label> 
                    </ion-card-header>

                    <ion-card-content>
                        <ion-label slot="start">${element.RecipeDescription}</ion-label>
                    </ion-card-content>

                </ion-card>
            `;

            document.getElementById("indexRecipes").innerHTML += recipeList;
        });
    }
}

var getId = 0;
function getIdFromEl(element){
    getId = element.id;
}

function saveIdToLocal(element){
    var getRecipeId = JSON.parse(localStorage.getItem("recipeId"));
    getRecipeId = element.id;
    localStorage.setItem("recipeId", JSON.stringify(getRecipeId));
}



function getCamera(i){
    navigator.camera.getPicture(onSuccess, onFail,{
        quantity: 100,
        saveToPhotoAlbum:false,
        destinationType: Camera.DestinationType.DATA_URL
        
    });

    function onSuccess(imageData) { 
        var recipeImage = document.getElementById('recipeImage'); 
        recipeImage = "data:image/jpeg;base64," + imageData;
    
        var getRecipes = JSON.parse(localStorage.getItem("allRecipes"));
        getRecipes[i].RecipeImage = recipeImage;
        localStorage.setItem("allRecipes", JSON.stringify(getRecipes));  
    }  

    function onFail(message) { 
        alert('Failed because: ' + message); 
    } 
}


const modalElement = document.createElement('ion-modal');
customElements.define('modal-page', class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <ion-header>            <ion-toolbar color="success">
            <ion-title>${modalElement.componentProps.id.RecipeName}</ion-title>
            <ion-buttons slot="primary">
                <ion-button onClick="dismissModal()">
                <ion-icon slot="icon-only" name="close"></ion-icon>
                </ion-button>
            </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-img src="${modalElement.componentProps.id.RecipeImage}" id="recipeImage" alt="Image"></ion-img>
        </ion-content>;`;
  }
});

function presentModal(id) {
    var getRecipes = JSON.parse(localStorage.getItem("allRecipes"));
    modalElement.component = 'modal-page';
    modalElement.componentProps = {
    'id': getRecipes[id]
  };

  // present the modal
  document.body.appendChild(modalElement);
  return modalElement.present();

}

async function dismissModal() { //the exit button
  await modalElement.dismiss({
    'dismissed': true
  });
}