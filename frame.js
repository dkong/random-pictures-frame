$(document).ready(function(){
    var clientId = '8d99549ecaaa42358ba1daea136070ad';
    var url = "https://api.instagram.com/v1/media/popular?client_id=" + clientId;

    var images = [];
    var currentIndex = 0;

    var paused = false;
    var slideShowTimer = null;

    function prevImage() {
        if (--currentIndex < 0)
            currentIndex = 0;
    }

    function nextImage() {
        if (++currentIndex >= images.length) {
            fetchImages();
            return false;
        }

        return true;
    }

    function displayImage() {
        if (!images || images.length === 0)
            return;

        if (currentIndex < 0 || currentIndex >= images.length)
            return;

        var image = images[currentIndex];
        $("#image").attr('src', image.images.standard_resolution.url);
        console.log( image.images.standard_resolution.url);

        // nextImage could fetch more images which in turn calls displayImage.
        if (!paused) {
            setDisplayTimeout();
        }
    }

    function clearDisplayTimeout() {
        clearTimeout(slideShowTimer);
        slideShowTimer = null;
    }

    function setDisplayTimeout() {
        var displayLength = $("#display-length").val();

        clearTimeout(slideShowTimer);
        slideShowTimer = setTimeout(function(){
            nextImage();
            displayImage();
        }, displayLength * 1000 );
    }

    function fetchImages() {
        console.log( "fetch: " + url );

        $.get(
            url,
            function(response){
                console.log( response );
                images = images.concat(response.data);

                displayImage();
            },
            'jsonp'
        );
    }

    $("#display-length").change(
        function(){
            console.log("display length: " + $("#display-length").val());
        }
    );

    function pauseSlideShow() {
        if (paused)
            return;

        console.log("Paused");
        paused = true;
        $("#play-pause").text( "Play" );
        clearDisplayTimeout();
    }

    function playSlideShow() {
        if (!paused)
            return;

        console.log("Resume");
        paused = false;
        $("#play-pause").text( "Pause" );
        setDisplayTimeout();
    }

    function togglePausePlay() {
        if (paused)
            playSlideShow();
        else
            pauseSlideShow();
    }

    $("#play-pause").click(togglePausePlay);

    $(document).keydown(function(e){
        if (e.which == 37) {
            pauseSlideShow();
            prevImage();
            displayImage();
            return false;
        } else if (e.which == 39) {
            pauseSlideShow();
            nextImage();
            displayImage();
            return false;
        } else if (e.which == 32) {
            togglePausePlay();
            return false;
        }
    });

    fetchImages();
});
