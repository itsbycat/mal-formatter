const fs = require("fs")
const path = require("path")
const xml2js = require("xml2js")

console.log("My Anime List Json Formatter || bycat.one")

function anime(file, table)
{
    var ret = {}
    ret["info"] = []
    ret["watching"] = []
    ret["completed"] = []
    ret["plan to watch"] = []
    
    for (let i = 0; i < table.anime.length; i++)
    {
        v = table.anime[i]
        current = null
        if (v.series_episodes[0] == v.my_watched_episodes[0])
        {
            current = ret["completed"]
        }
        else if (v.my_watched_episodes[0] > 0)
        {
            current = ret["watching"]
        }
        else {
            current = ret["plan to watch"]
        }

        current.push({
            name: v.series_title[0],
            episode: v.my_watched_episodes[0] + "/" + v.series_episodes[0],
            score: v.my_score[0],
        })
    }

    ret["info"].push({
        ["user name"]: table.myinfo[0].user_name[0],
        ["total anime"]: table.anime.length,
        ["total completed"]: ret["completed"].length,
        ["total watching"]: ret["watching"].length,
        ["total plan to watch"]: ret["plan to watch"].length,
    })
    
    fs.writeFile(path.basename(file, ".xml") + ".json", JSON.stringify(ret, null, 2), (err) => {
        if (err) throw err;
    
        console.log("[anime] %s.json created (total %s anime)", path.basename(file, ".xml"), table.anime.length)
    })
}

function manga(file, table)
{
    var ret = {}
    ret["info"] = []
    ret["reading"] = []
    ret["completed"] = []
    ret["plan to read"] = []
    
    for (let i = 0; i < table.manga.length; i++)
    {
        v = table.manga[i]
        current = null
        if (v.my_read_volumes[0] == v.manga_volumes[0] && v.my_read_chapters[0] == v.manga_chapters[0])
        {
            current = ret["completed"]
        }
        else if (v.my_read_volumes[0] == 0 && v.my_read_chapters[0] == 0)
        {
            current = ret["plan to read"]
        }
        else {
            current = ret["reading"]
        }

        current.push({
            name: v.manga_title[0],
            volume: v.my_read_volumes[0] + "/" + v.manga_volumes[0],
            chapter: v.my_read_chapters[0] + "/" + v.manga_chapters[0],
            score: v.my_score[0],
        })
    }

    ret["info"].push({
        ["user name"]: table.myinfo[0].user_name[0],
        ["total manga"]: table.manga.length,
        ["total completed"]: ret["completed"].length,
        ["total reading"]: ret["reading"].length,
        ["total plan to read"]: ret["plan to read"].length,
    })
    
    fs.writeFile(path.basename(file, ".xml") + ".json", JSON.stringify(ret, null, 2), (err) => {
        if (err) throw err;
    
        console.log("[manga] %s.json created (total %s manga)", path.basename(file, ".xml"), table.manga.length)
    })
}

fs.readdir("./", function (err, files){
    if (err) { return console.log("Unable to scan directory: " + err) }

    files.forEach(function (file) {
        if (path.extname(file) === ".xml") {
            fs.readFile(file, "utf-8", (err, data) => {
                if (err) throw err;
            
                xml2js.parseString(data, (err, result) => {
                    if (err) throw err;
            
                    var table = result.myanimelist

                    if (table.myinfo[0].user_export_type[0] == 1)
                    {
                        anime(file, table)
                    }
        
                    if (table.myinfo[0].user_export_type[0] == 2)
                    {
                        manga(file, table)
                    }
                })
            })
        }
    })
})