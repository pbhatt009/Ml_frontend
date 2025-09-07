
const try_catch = async(func) => {

    try {
        const res = await func();
        console.log(res.data);
        return res.data;
    } 
    catch (error) {
        console.error(error);
        const errorPayload = {
            status: error?.response?.status || 500,
            message:
                error?.response?.data?.detail?.errors?.message ||
                error?.response?.data?.message ||
                error?.message ||
                "Unexpected error",
        };
        return {error_data:errorPayload};
       

        
    }
   
}
export default try_catch;