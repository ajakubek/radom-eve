function Loader()
{
    this.numAddedImages = 0;
    this.numLoadedImages = 0;

    var images = {};
    var listFinished = false;
    var onImageLoadedCallback = null;
    var onAllLoadedCallback = null;
    var onErrorCallback = null;
    var self = this;


    // callbacks

    function imageLoaded()
    {
        ++self.numLoadedImages;
        if (listFinished && onImageLoadedCallback)
            onImageLoadedCallback();
        checkLoadingState();
    }

    function loadError(name, url)
    {
        var error = 'Failed to load asset ' + name + ' from URL ' + url;

        if (onErrorCallback)
            onErrorCallback(error);
        else
            alert(error);
    }


    // private methods

    function checkLoadingState()
    {
        if (listFinished)
        {
            if (self.numLoadedImages >= self.numAddedImages)
            {
                if (onAllLoadedCallback)
                    onAllLoadedCallback();
                return true;
            }
        }
        return false;
    }


    // public methods

    this.onImageLoaded = function(callback)
    {
        onImageLoadedCallback = callback;
    };

    this.onAllLoaded = function(callback)
    {
        onAllLoadedCallback = callback;
    };

    this.onError = function(callback)
    {
        onErrorCallback = callback;
    }

    this.addImage = function(name, url)
    {
        if (!listFinished)
        {
            var image = new Image();
            image.onload = imageLoaded;
            image.onerror =
                function()
                {
                    loadError(name, url);
                };
            image.src = url;
            images[name] = image;
            ++this.numAddedImages;
        }
        return this;
    };

    this.finish = function()
    {
        listFinished = true;
        checkLoadingState();
        return this;
    };

    this.getImage = function(name)
    {
        if (!listFinished)
            return null;

        return images[name];
    };
};
