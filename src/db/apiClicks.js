import supabase from "./supabase";
import UAParser from "ua-parser-js"

export async function getClicks(urlIds) {
    const { data, error } = await supabase
                                            .from('clicks')
                                            .select('*')
                                            .in('url_id',urlIds)
    if(error){
        console.log(error.message);
        throw new Error("Unable to load Clicks");
    }

    return data;

}

const parser = new UAParser()

export const storeClicks = async({id, originalUrl}) => {
    try {
        const res = parser.getResult();
        const device = res.device.type || "desktop";
        console.log(res.device,res?.type)
        const response = await fetch("https://ipapi.co/json");
        const {city, country_name: country} = await response.json();
        await supabase.from("clicks").insert({
            url_id: id,
            city: city,
            country: country,
            device: device
        })
        window.location.href = originalUrl
    } catch (error) {
        console.log("Error redirecting ", error.message)
    }
}

export async function getClicksForUrl(url_id){
    const {data, error} = await supabase.from("clicks").select("*").eq("url_id",url_id);

    if(error) throw new Error(error.message);

    return data;
}