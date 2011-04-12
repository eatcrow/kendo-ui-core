(function($, window) {
    var kendo = window.kendo;

    function Pager(element, options) {
        var that = this;
        that.element = element;
        that.wrapper = $(element);
        that.dataSource = options.dataSource;
        that.options = $.extend({}, that.defaults, options);
        that.linkTemplate = kendo.core.template(that.options.linkTemplate);
        that.selectTemplate = kendo.core.template(that.options.selectTemplate);

        that.dataSource.bind("kendo:change", $.proxy(that.render, that));
        that.wrapper.delegate("a:not(.currentPage)", "click",  $.proxy(that._click, that));
    }

    Pager.prototype = {
        defaults: {
            selectTemplate: '<li><a href="#" class="currentPage"><span>Page</span><%=text %></a></li>',
            linkTemplate: '<li><a href="#" + data-page="<%=idx %>"><%= isNum ? "<span>Page</span>" : "" %><%=text %></a></li>',
            buttonCount: 10
        },
        render: function() {
            var that = this,
                idx,
                end,
                start = 1,
                html = "",
                reminder,
                page = that.page(),
                totalPages = that.totalPages(),
                buttonCount = that.options.buttonCount;

            if (page > buttonCount) {
                reminder = (page % buttonCount);

                start = (reminder == 0) ? (page - buttonCount) + 1 : (page - reminder) + 1;
            }

            end = Math.min((start + buttonCount) - 1, totalPages);

            if(start > 1) {
                html += that.linkTemplate({idx: (start - 1), text: "...", isNum: false });
            }

            for(idx = start; idx <= end; idx++) {
                html += (idx == page) ? that.selectTemplate({ text: idx }) : that.linkTemplate( { idx: idx, text: idx, isNum: true});
            }

            if(end < totalPages) {
                html += that.linkTemplate({idx: idx, text: "...", isNum: false });
            }

            that.wrapper.empty().append(html);
        },

        _click: function(e) {
            var page = $(e.currentTarget).data("page");
            e.preventDefault();

            this.dataSource.page(page);

            this.wrapper.trigger("kendo:change", [page]);
        },

        totalPages: function() {
            return Math.ceil((this.dataSource.total() || 0) / this.pageSize());
        },

        pageSize: function() {
            return this.dataSource.pageSize() || 0;
        },

        page: function() {
            return this.dataSource.page() || 1;
        }
    }

    $.fn.kendoPager = function(options) {
        $(this).each(function() {
            $(this).data("kendoPager", new Pager(this, options));
        });

        return this;
    }

    kendo.ui.Pager = Pager;

})(jQuery, window);
