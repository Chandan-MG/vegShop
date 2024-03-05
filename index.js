document.addEventListener("DOMContentLoaded", function(){
    fetchData();
});

function handleSubmit(event){
    event.preventDefault();
    
    const vegetables = {
        name: event.target.name.value,
        price: event.target.price.value,
        quantity: event.target.quantity.value
    }

    axios.post(
        "https://crudcrud.com/api/d59702a9320741c58d8a1eb9a8403ce9/vegshop",
        vegetables
        )
        .then((response) => {
            event.target.reset();
            fetchData();
            updateCount();
        })
        .catch((error) => console.log(error));
}

function fetchData(){
    axios.get("https://crudcrud.com/api/d59702a9320741c58d8a1eb9a8403ce9/vegshop")
    .then((response) => {
      const users = response.data;
      const list = document.getElementById('vegetableList');

      list.innerHTML = '';

      users.forEach(user => {
        const listItem = displayvegetablesOnScreen(user);
        list.appendChild(listItem);
      });
    })
    .catch((error) => console.log(error));
}



function displayvegetablesOnScreen(user){
    const li = document.createElement('li');
    li.textContent = `${user.name}   - Rs: ${user.price}   - KG: ${user.quantity}`;

    //create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input'; 

    //create delete button
    const buy = document.createElement('button');
    buy.textContent = "Buy";
    buy.dataset.id= user._id;
    buy.addEventListener('click', function(){
        const id = this.dataset.id;
        const quantityInput = this.previousElementSibling;// Get the input field
        const quantityToBuy = parseFloat(quantityInput.value);
        const originalQuantity = parseFloat(user.quantity);
        if(!isNaN(quantityToBuy) && quantityToBuy>0 && quantityToBuy<=originalQuantity){
            const newQuantity = originalQuantity - quantityToBuy;
            buyVegetable(id, newQuantity, li, user.name, user.price);
        }
        else{
            alert("Please enter valid quantity.")
        }
    })

    //create delete button
    const dlt = document.createElement('button');
    dlt.textContent = "Delete Expense";
    dlt.dataset.id = user._id; // Set the id as a data attribute
    dlt.addEventListener( 'click', function(){ 
        const id = this.dataset.id;
        deleteVegetable(id);
        this.closest('li').remove();
    });

    li.appendChild(input);
    li.appendChild(buy);
    li.appendChild(dlt);


    return li;
}

function buyVegetable(id, newQuantity, li, name, price){
    axios.put(`https://crudcrud.com/api/d59702a9320741c58d8a1eb9a8403ce9/vegshop/${id}`, { quantity: newQuantity })
        .then(() => {
            alert("Vegetable buyed..");
            const newContent = `${name}   - Rs: ${price}   - KG: ${newQuantity}`; // Update the displayed quantity on the screen
        })
        .catch((error) => console.log(error));
}

function deleteVegetable(id){
    axios.delete(`https://crudcrud.com/api/d59702a9320741c58d8a1eb9a8403ce9/vegshop/${id}`)
        .then(()=>{
            const userItem = document.querySelector(`li[data-id="${id}"]`);
            if(userItem){
                userItem.remove();
            }
        })
        .catch((err)=> console.log(err));
}

function updateCount(){
    axios.get("https://crudcrud.com/api/d59702a9320741c58d8a1eb9a8403ce9/vegshop")
    .then((response) => {
        const listContainer = document.getElementById('vegetableList');
        const vegetables = response.data;
        const totalCount = vegetables.length;
        const totalElement = document.getElementById('total');
        totalElement.textContent = `Total: ${totalCount}`;
    })
    .catch((error) => console.log(error));
}


