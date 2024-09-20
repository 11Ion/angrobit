async function fetchUserData() {
    try {
        const response = await fetch("../../temp/data.json");
        const data = await response.json();

        const user = data.users[0]; 

        if(user){
            document.querySelector('[data-username]').textContent = user.username;
            document.querySelector('[data-username]').setAttribute('data-username', user.username);
    
            document.querySelector('[data-level]').textContent = user.level;
            document.querySelector('[data-level]').setAttribute('data-level', user.level);
    
            document.querySelector('[data-balance1]').textContent = user.balance1;
            document.querySelector('[data-balance1]').setAttribute('data-balance1', user.balance1);
    
            document.querySelector('[data-balance2]').textContent = user.balance2;
            document.querySelector('[data-balance2]').setAttribute('data-balance2', user.balance2);

                
            document.querySelector('[data-image]').setAttribute('src', user.image);
            document.querySelector('[data-image]').setAttribute('alt', user.username);
            document.querySelector('[data-image]').setAttribute('data-image', user.image);

        }

    } catch (error) {
        console.error('Eroare loading data:', error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    fetchUserData();
});
