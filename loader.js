function Loader()
{
    this.numAddedImages = 0;
    this.numLoadedImages = 0;

    this.numAddedSounds = 0;
    this.numLoadedSounds = 0;

    var images = {};
    var sounds = {};
    var listFinished = false;
    var onImageLoadedCallback = null;
    var onSoundLoadedCallback = null;
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

    function soundLoaded()
    {
        ++self.numLoadedSounds;
        if (listFinished && onSoundLoadedCallback)
            onSoundLoadedCallback();
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
            if (self.numLoadedImages >= self.numAddedImages &&
                self.numLoadedSounds >= self.numAddedSounds)
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

    this.onSoundLoaded = function(callback)
    {
        onSoundLoadedCallback = callback;
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
            var imageElement = new Image();
            imageElement.onload = imageLoaded;
            imageElement.onerror =
                function()
                {
                    loadError(name, url);
                };
            imageElement.src = url;
            images[name] = imageElement;
            ++this.numAddedImages;
        }
        return this;
    };

    this.addSound = function(name, url)
    {
        if (typeof Audio == 'undefined')
            return this;

        if (!listFinished)
        {
            var audioElement = new Audio();
            audioElement.preload = 'auto';
            audioElement.addEventListener('canplaythrough', soundLoaded, false);
            audioElement.onerror =
                function()
                {
                    loadError(name, url);
                };
            audioElement.src = url;
            sounds[name] = audioElement;
            ++this.numAddedSounds;
        }
        return this;

    }

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

    this.getSound = function(name)
    {
        if (!listFinished)
            return null;

        return sounds[name];
    }
};
