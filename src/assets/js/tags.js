var $canvas = document.getElementById("word_cloud");
var baseFont = '30';

if($canvas){
    $canvas.width  = window.innerWidth;
    $canvas.height = window.innerHeight;
    document.body.scrollTop = 0;
    document.body.style.overflow = 'hidden'; 
    // Get all tags data API
    wordCloudData = [];
    name_slug_map = {};
    $.get('/ghost/api/content/tags/?include=count.posts&limit=all&key=eee5570fd18c98ef8db173ff08').done(function (data){
        for(var i=0 ;i<data.tags.length;i++){
            var temp = [];
            temp.push(data.tags[i].name);
            temp.push(data.tags[i].count.posts).toString();
            name_slug_map[data.tags[i].name] = data.tags[i].slug;
            wordCloudData.push(temp);
        };
        var options = { 
            list : wordCloudData,      
            weightFactor: function (size) {
                return (size === 1) ? baseFont : 10 * size * 2;
            },
            fontWeight: 'bold',
            fontFamily: 'Cardo',
            rotateRatio: 0,
            color: '#a0a8b0',
            click: function(item) {
                window.location.href = "./../tag/" + name_slug_map[item[0]];
            },
            hover: function(item) {
                $canvas.style.cursor = item ? 'pointer' : 'default';
            },
        }
        WordCloud(document.getElementById('word_cloud'), options);
    }).fail(function (err){
        console.log(err);
    });
}