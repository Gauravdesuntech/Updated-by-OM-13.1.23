
export const showError=(error)=>{
    const sources = error.response;
    if (sources === undefined){
        alert('Something Went Wrong!')
    }else {
        if(422 === error.response.status) {
            Object.keys(error.response.data.errors).forEach((key)=>{
                error.response.data.errors[key].forEach((error)=>{
                    alert(error)
                });
            });
        } else{
            alert(sources.data.message)
        }
    }
}
