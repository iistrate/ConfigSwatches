/*
 * On clicking swatches, script sends product id info and returns a list of image objects to be used in more views
 */
var CustomSwatches = function(selector) {

    var superAttrId;
    var swatchesUrl;

    var swatches = $j(selector).first();
    var elSelect = swatches.find(".super-attribute-select").first();

    //thumbnail holder
    var elMoreViews = $j(".product-image-thumbs");
    var elGallery   = $j(".product-image-gallery");
    var elMediaBox  = $j(".product-image");


    var watchForClicks = function() {
        swatches.find(".input-box").first().find('li').on('click', grabImages);
    };

    var disableClicks = function() {
        swatches.find(".input-box").first().find('li').off('click', grabImages);
    };

    var getConfig = function() {
        //get the super attribute id
        superAttrId = grabNumberFromString(elSelect.attr('id'));
        //get the url to the image generator page
        swatchesUrl = elSelect.data('url');
    };

    var grabImages = function() {
        getConfig();
        //grab the product id; in the options are saved as value
        var itemId = $j(this).attr('value');
        //get attribute id
        var id = grabNumberFromString(itemId);
        var pid = getProductId(id);
        //show the loading overlay
        showLoading(typeof elMoreViews === 'undefined' ? elMoreViews.offset().top : 0);
        disableClicks();

        //ajaxit
        var Xhr = jQuery.ajax({
            url: swatchesUrl,
            data: {
              pid: pid
            },
            dataType: "json"

        }).done(function(data) {
            //add images to thumb and gallery
            addImages(data);
            //hide the loading overlay
            hideLoading();
            watchForClicks();
        });
    };

    var showLoading = function(position) {
        //append and prep the overlay container
        console.log(elMediaBox)
        elMediaBox.css({position:'relative'});
        elMediaBox.append("<div class='overlay'></div>");
        //add css
        elMediaBox.find('.overlay')
        .css({
            position    : 'absolute',
            left        : 0,
            top         : (position || 0) + 'px',
            width       : "100%",
            height      : "100%",
            background  : "white url('/skin/frontend/moscot/default/images/ajax-loader.gif') center center no-repeat"
        });
    };

    var hideLoading = function() {
        $j('.info').find('.overlay').remove();
    };

    var addImages = function(data) {
        //clear html for both
        elMoreViews.html('');
        elGallery.html('');

        //foreach data object [[image, thumb],[image, thumb]...]
        data.forEach(function(d, index) {

            //decide if image will be visible, in this case we're only showing the first image on load
            var visibility = index == 0 ? "visible" : "";

            //append to the gallery
            elGallery.append(
                "<img itemprop='image' src='"+ d.image +"' id='item-"+ index +"' class='gallery-image gallery-item "+visibility+" ' />"
            );
            //append to the thumbnails
            elMoreViews.append(
                "<li><a class='thumb-link' href='#item-"+ index +"' data-image-index='"+ index +"'><img src='"+ d.thumb +"' /></a></li>"
            );
        });

        //add listeners for displaying thumbs, gallery image
        linkThumbnails();
    };

    var linkThumbnails = function() {
        //add listener to thumbs
        elMoreViews.find('a').on('click', function(e) {
            e.preventDefault();
            //grab image index
            var imageIndex = $j(this).data('image-index');
            elGallery.find('.visible').toggleClass('visible');
            elGallery.find('img[id=item-'+imageIndex+']').toggleClass('visible');
        });
    };

    //gets numbers from strings
    var grabNumberFromString = function(string) {
        return +string.replace(/\D/g, '');
    };

    //grabs the products id corresponding to an attribute id
    var getProductId = function(id) {
        var prodInfo = spConfig['config']['attributes'][superAttrId]['options'];
        for (var i = 0, j = prodInfo.length; i < j; i++) {
            if (prodInfo[i].id == id) {
                return prodInfo[i].products[0];
            }
        }
    };

    this.init = function() {
        if (typeof elMoreViews !== 'undefined') watchForClicks();
    }

};
