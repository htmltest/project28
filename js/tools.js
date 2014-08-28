var iScrollInstance;

(function($) {

    $(document).ready(function() {

        var ua = navigator.userAgent,
        isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);

        // меню
        $('nav a, .header-order-link, .promo-order-link').click(function(e) {
            if ($('html').hasClass('mobile')) {
                iScrollInstance.scrollTo(0, -$($(this).attr('href')).offset().top + $('.wrapper-inner').offset().top + 40, 500);
            } else {
                $.scrollTo($($(this).attr('href')), 500, {offset: {'top': -40}});
            }
            e.preventDefault();
        });

        $('.promo-top-line').click(function() {
            if ($('body').hasClass('promo-fixed')) {
                if ($('html').hasClass('mobile')) {
                    iScrollInstance.scrollTo(0, 0, 500);
                } else {
                    $.scrollTo(0, 500);
                }
            }
        });

        // наведение на блоки "почему"
        if (isMobileWebkit) {
            $('.why-item').click(function() {
                var curBlock = $(this);
                if (curBlock.hasClass('hover')) {
                    curBlock.removeClass('hover');
                } else {
                    $('.why-item').removeClass('hover');
                    curBlock.addClass('hover');
                    curBlock.find('.why-item-bg').css({'padding-bottom': curBlock.find('.why-item-add').height() + 17});
                }
            });

            $(document).click(function(e) {
                if ($(e.target).parents().filter('.why-item').length == 0) {
                    $('.why-item').removeClass('hover');
                }
            });
        } else {
            $('.why-item').addClass('isHover');
            $('.why-item').mouseover(function() {
                var curBlock = $(this);
                curBlock.find('.why-item-bg').css({'padding-bottom': curBlock.find('.why-item-add').height() + 17});
            });
        }

        // подсказка в полях форм
        $('.order-mini-input input, .order-textarea textarea').each(function() {
            if ($(this).val() == '') {
                $(this).parent().find('span').css({'display': 'block'});
            }
        });

        $('.order-mini-input input, .order-textarea textarea').focus(function() {
            $(this).parent().find('span').css({'display': 'none'});
        });

        $('.order-mini-input input, .order-textarea textarea').blur(function() {
            if ($(this).val() == '') {
                $(this).parent().find('span').css({'display': 'block'});
            }
        });

        // телефон
        $('input[name="phone"]').mask('+7 (999) 999-99-99');

        // валидация форм
        $('form').each(function() {
            $(this).validate({
                submitHandler: function(form) {
                    $.ajax({
                        url: $(form).attr('action'),
                        dataType: 'html',
                        cache: false
                    }).done(function(html) {
                        windowOpen(html);
                    });
                }
            });
        });

        // видео
        $('.video-container a').click(function(e) {
            var curLink = $(this);
            curLink.parent().find('.video-play').html('<iframe width="778" height="435" src="' + curLink.attr('href') + '?wmode=transparent&autoplay=1" frameborder="0" allowfullscreen></iframe>').show();
            curLink.hide();
            e.preventDefault();
        });

        $('.video').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);

            if (curSlider.find('li').length < 2) {
                curSlider.find('.video-next, .video-prev').hide();
            }
        });

        $('.video-next').click(function(e) {
            var curSlider = $(this).parent();

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex++;
                if (curIndex == curSlider.find('li').length) {
                    curIndex = 0;
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('.video-play').html('').hide();
                curSlider.find('.video-container a').show();
                curSlider.find('li:visible').fadeOut(function() {
                    curSlider.find('li').eq(curIndex).fadeIn(function() {
                        curSlider.data('curIndex', curIndex);
                        curSlider.data('disableAnimation', true);
                    });
                });
            }

            e.preventDefault();
        });

        $('.video-prev').click(function(e) {
            var curSlider = $(this).parent();

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex--;
                if (curIndex == -1) {
                    curIndex = curSlider.find('li').length - 1;
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('.video-play').html('').hide();
                curSlider.find('.video-container a').show();
                curSlider.find('li:visible').fadeOut(function() {
                    curSlider.find('li').eq(curIndex).fadeIn(function() {
                        curSlider.data('curIndex', curIndex);
                        curSlider.data('disableAnimation', true);
                    });
                });
            }

            e.preventDefault();
        });

        // фотогалерея
        $('.gallery').each(function() {
            var curSlider = $(this);
            curSlider.data('disableAnimation', true);

            var newHTML = '';
            for (var i = 0; i < curSlider.find('li').length; i++) {
                $('.gallery-map').eq(i).attr('usemap', '#gallery-map-' + i);
                $('map').eq(i).attr('name', 'gallery-map-' + i);
                newHTML += '<a href="#"></a>';
            }
            $('.gallery-ctrl').html(newHTML);
            $('.gallery-ctrl a:first').addClass('active');

            curSlider.find('li').each(function() {
                var curBlock = $(this);
                curBlock.find('area:gt(' + (curBlock.find('.gallery-links a').length - 1) + ')').remove();
            });
        });

        $('.gallery').on('click', '.gallery-ctrl a', function(e) {
            var curSlider = $('.gallery');

            if (curSlider.data('disableAnimation')) {
                var curIndex = $('.gallery-ctrl a').index($(this));

                $('.gallery-ctrl a').removeClass('active');
                $(this).addClass('active');

                curSlider.data('disableAnimation', false);
                curSlider.find('ul li:visible').fadeOut(function() {
                    curSlider.find('ul li').eq(curIndex).fadeIn(function() {
                        curSlider.data('disableAnimation', true);
                    });
                });
            }

            e.preventDefault();
        });

        $('.gallery-content area').hover(
            function() {
                var curBlock = $(this).parents().filter('li');
                var curIndex = curBlock.find('map area').index($(this));
                curBlock.find('.gallery-links a').eq(curIndex).css({'opacity': .9});
            },

            function() {
                var curBlock = $(this).parents().filter('li');
                var curIndex = curBlock.find('map area').index($(this));
                curBlock.find('.gallery-links a').eq(curIndex).css({'opacity': 1});
            }
        );

        $('.gallery-content area').click(function(e) {
            var curBlock = $(this).parents().filter('li');
            var curIndex = curBlock.find('map area').index($(this));
            curBlock.find('.gallery-links a').eq(curIndex).click();
            e.preventDefault();
        });

        $('.gallery').each(function() {
            $(window).load(function() {
                var newHTML = '<ul>';
                $('.gallery-links a').each(function() {
                    newHTML += '<li><a href="' + $(this).attr('href') + '"><img src="' + $(this).attr('rel') + '" alt="" width="67" height="68" /><span></span></a></li>';
                });
                newHTML += '</ul>';
                $('.item-gallery-list').prepend(newHTML);
                $('.item-gallery-list li:first').addClass('active');

                $('.item-gallery-list').each(function() {
                    var curSlider = $(this);
                    curSlider.data('curIndex', 0);
                    curSlider.data('disableAnimation', true);

                    curSlider.find('.item-gallery-list-prev').css({'display': 'none'});
                    if (curSlider.find('li').length < 11) {
                        curSlider.find('.item-gallery-list-next').css({'display': 'none'});
                    }
                    curSlider.find('li').eq(11).css({'visibility': 'hidden'});

                    curSlider.find('ul').width(79 * curSlider.find('li').length);
                });

            });
        });

        $('.gallery-links a').click(function(e) {
            var windowWidth     = $(window).width();
            var windowHeight    = $(window).height();
            var curScrollTop    = $(window).scrollTop();

            if (!isMobileWebkit) {
                $('body').css({'width': windowWidth, 'height': windowHeight, 'overflow': 'hidden'});
                $(window).scrollTop(0);
                $('#wrapper').css({'top': -curScrollTop});
                $('#wrapper').data('scrollTop', curScrollTop);
            }
            $('header, .promo-top').css({'margin-left': -($(window).width() - $('#wrapper').width()) / 2});
            $('#promo.fixed h1').css({'margin-left': -223 - ($(window).width() - $('#wrapper').width()) / 2});

            var curIndex = $('.gallery-links a').index($(this));
            $('.item-gallery-list ul li a').eq(curIndex).click();

            $('.item-gallery').addClass('item-gallery-open');

            e.preventDefault();
        });

        $('.item-gallery-close').click(function(e) {
            itemGalleryClose();
            e.preventDefault();
        });

        $('body').keyup(function(e) {
            if (e.keyCode == 27) {
                itemGalleryClose();
            }
        });

        function itemGalleryClose() {
            if ($('.item-gallery-open').length > 0) {
                if (!isMobileWebkit) {
                    $('#wrapper').css({'top': 'auto', 'left': 'auto'});
                    $('body').css({'width': 'auto', 'height': '100%', 'overflow': 'visible'});
                    $(window).scrollTop($('#wrapper').data('scrollTop'));
                }
                $('header, .promo-top').css({'margin-left': 0});
                $('#promo.fixed h1').removeAttr('style');

                $('.item-gallery').removeClass('item-gallery-open');
            }
        }

        $(window).bind('load resize', function() {
            var contentHeight   = $(window).height() - ($('.item-gallery-text').height() + $('.item-gallery-list').height());
            $('.item-gallery-big').css({'height': contentHeight, 'line-height': contentHeight + 'px'});
            $('.item-gallery-big img').css({'max-height': contentHeight});
        });

        $('.item-gallery').on('click', '.item-gallery-list ul li a', function(e) {
            $('.item-gallery-loading').show();
            var curLink = $(this);
            var curLi   = curLink.parent();

            var contentHeight   = $(window).height() - $('.item-gallery-list').height() - 40;
            $('.item-gallery-big').css({'height': contentHeight, 'line-height': contentHeight + 'px'});

            var curIndex = $('.item-gallery-list ul li').index(curLi);
            $('.item-gallery-load img').attr('src', curLink.attr('href'));
            $('.item-gallery-load img').load(function() {
                $('.item-gallery-big img').attr('src', curLink.attr('href'));
                $('.item-gallery-big img').width('auto');
                $('.item-gallery-big img').height('auto');

                var curWidth = $('.item-gallery-big').width();
                var curHeight = $('.item-gallery-big').height();

                var imgWidth = $('.item-gallery-big img').width();
                var imgHeight = $('.item-gallery-big img').height();

                var newWidth = curWidth;
                var newHeight = imgHeight * newWidth / imgWidth;

                if (newHeight > curHeight) {
                    newHeight = curHeight;
                    newWidth = imgWidth * newHeight / imgHeight;
                }

                $('.item-gallery-big img').width(newWidth);
                $('.item-gallery-big img').height(newHeight);

                $('.item-gallery-big strong').height($('.item-gallery-big img').height());
                $('.item-gallery-big strong').css({'visibility': 'visible'});

                $('.item-gallery-loading').hide();
            });
            $('.item-gallery-list ul li.active').removeClass('active');
            curLi.addClass('active');

            e.preventDefault();
        });

        $('.item-gallery-prev').click(function(e) {
            var curIndex = $('.item-gallery-list ul li').index($('.item-gallery-list ul li.active'));
            curIndex--;
            if (curIndex < 0) {
                curIndex = $('.item-gallery-list ul li').length - 1;
            }
            $('.item-gallery-list ul li').eq(curIndex).find('a').click();
            if (curIndex < $('.item-gallery-list').data('curIndex') + 1) {
                $('.item-gallery-list-prev').click();
            }

            e.preventDefault();
        });

        $('.item-gallery-next').click(function(e) {
            var curIndex = $('.item-gallery-list ul li').index($('.item-gallery-list ul li.active'));
            curIndex++;
            if (curIndex >= $('.item-gallery-list ul li').length) {
                curIndex = 0;
            }
            $('.item-gallery-list ul li').eq(curIndex).find('a').click();
            if (curIndex > $('.item-gallery-list').data('curIndex') + 10) {
                $('.item-gallery-list-next').click();
            }

            e.preventDefault();
        });

        $('.item-gallery-list-next').click(function(e) {
            var curSlider = $('.item-gallery-list');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex += 10;
                curSlider.find('.item-gallery-list-prev').css({'display': 'block'});
                curSlider.find('li').css({'visibility': 'visible'});
                if (curIndex >= curSlider.find('li').length - 12) {
                    curIndex = curSlider.find('li').length - 12;
                    curSlider.find('.item-gallery-list-next').css({'display': 'none'});
                }
                curSlider.find('li').eq(curIndex + 11).css({'visibility': 'hidden'});
                curSlider.find('li').eq(curIndex).css({'visibility': 'hidden'});
                if (curIndex == curSlider.find('li').length - 12) {
                    curSlider.find('li').eq(curIndex + 11).css({'visibility': 'visible'});
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * 79}, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                });
            }

            e.preventDefault();
        });

        $('.item-gallery-list-prev').click(function(e) {
            var curSlider = $('.item-gallery-list');

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex -= 10;
                curSlider.find('.item-gallery-list-next').css({'display': 'block'});
                curSlider.find('li').css({'visibility': 'visible'});
                if (curIndex <= 0) {
                    curIndex = 0;
                    curSlider.find('.item-gallery-list-prev').css({'display': 'none'});
                }
                curSlider.find('li').eq(curIndex).css({'visibility': 'hidden'});
                curSlider.find('li').eq(curIndex + 11).css({'visibility': 'hidden'});
                if (curIndex == 0) {
                    curSlider.find('li').eq(curIndex).css({'visibility': 'visible'});
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * 79}, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                });
            }

            e.preventDefault();
        });

        if (isMobileWebkit) {
            $('html').addClass('mobile');
        }

        if (isMobileWebkit) {
            iScrollInstance = new iScroll('wrapper', {
                onScrollMove: updatePromo,
                onScrollEnd: updatePromo
            });
            function updatePromo() {
                if (-$('.wrapper-inner').offset().top >= 337) {
                    $('body').addClass('promo-fixed');
                    $('.promo-top-line').css({'margin-top': 0});
                } else {
                    $('body').removeClass('promo-fixed');
                    $('.promo-top-line').css({'margin-top': $('.wrapper-inner').offset().top});
                }
            }
            $('.wrapper-inner').stellar({
                scrollProperty: 'transform',
                positionProperty: 'transform',
                horizontalScrolling: false,
            });
        } else {
            $.stellar({
                horizontalScrolling: false
            });

            $(window).bind('load resize scroll', function() {
                if ($(window).scrollTop() >= 337) {
                    $('body').addClass('promo-fixed');
                } else {
                    $('body').removeClass('promo-fixed');
                }
            });
        }

        // окно
        $('.promo-label, .footnote-link, .bonus-text a, .order-want-item-text a').click(function(e) {
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                windowOpen(html);
            });
            e.preventDefault();
        });

    });

    // открытие окна
    function windowOpen(contentWindow) {
        var ua = navigator.userAgent,
        isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);

        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();

        if (!isMobileWebkit) {
            $('body').css({'width': windowWidth, 'height': windowHeight, 'overflow': 'hidden'});
            $(window).scrollTop(0);
            $('#wrapper').css({'top': -curScrollTop});
            $('#wrapper').data('scrollTop', curScrollTop);
            $('header, .promo-top').css({'margin-left': -($(window).width() - $('#wrapper').width()) / 2});
            $('#promo.fixed h1').css({'margin-left': -223 - ($(window).width() - $('#wrapper').width()) / 2});
        }

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-container"><div class="window-content">' + contentWindow + '<a href="#" class="window-close"></a></div></div></div>')

        if ($('.window-container').width() > windowWidth - 40) {
            $('.window-container').css({'margin-left': 20, 'left': 'auto'});
            $('.window-overlay').width($('.window-container').width() + 40);
        } else {
            $('.window-container').css({'margin-left': -$('.window-container').width() / 2});
        }

        if ($('.window-container').height() > windowHeight - 40) {
            $('.window-container').css({'margin-top': 20, 'top': 'auto'});
            $('.window-overlay').height($('.window-container').height() + 40);
        } else {
            $('.window-container').css({'margin-top': -$('.window-container').height() / 2});
        }

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);
    }

    // обработка Esc после открытия окна
    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    // закрытие окна
    function windowClose() {
        var ua = navigator.userAgent,
        isMobileWebkit = /WebKit/.test(ua) && /Mobile/.test(ua);

        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        if (!isMobileWebkit) {
            $('#wrapper').css({'top': 'auto', 'left': 'auto'});
        }
        $('header, .promo-top').css({'margin-left': 0});
        $('#promo.fixed h1').removeAttr('style');
        if (isMobileWebkit) {
            $('body').css({'width': 'auto', 'height': '100%', 'overflow': 'hidden'});
        } else {
            $('body').css({'width': 'auto', 'height': '100%', 'overflow': 'visible'});
        }
        $(window).scrollTop($('#wrapper').data('scrollTop'));
    }

})(jQuery);