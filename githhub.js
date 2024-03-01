const token = 'YOUR_PERSONAL_ACCESS_TOKEN';

export const getUser = async () => {
    const response = await fetch('https://api.github.com/user', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    console.log(data);
};
