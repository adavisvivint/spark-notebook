//----------------------------------------------------------------------------
//  Copyright (C) 2008-2011  The IPython Development Team
//
//  Distributed under the terms of the BSD License.  The full license is in
//  the file COPYING, distributed as part of this software.
//----------------------------------------------------------------------------

//============================================================================
// SaveWidget
//============================================================================

var IPython = (function (IPython) {

    var utils = IPython.utils;

    var SaveWidget = function (selector) {
        this.selector = selector;
        if (this.selector !== undefined) {
            this.element = $(selector);
            this.style();
            this.bind_events();
        }
    };


    SaveWidget.prototype.style = function () {
        this.element.find('span#save_widget').addClass('ui-widget');
        this.element.find('span#notebook_name').addClass('ui-widget ui-widget-content');
        this.element.find('span#save_status').addClass('ui-widget ui-widget-content')
            .css({border: 'none', 'margin-left': '20px'});
    };


    SaveWidget.prototype.bind_events = function () {
        var that = this;
        this.element.find('span#notebook_name').click(function () {
            that.rename_notebook();
        });
        this.element.find('span#notebook_name').hover(function () {
            $(this).addClass("ui-state-hover");
        }, function () {
            $(this).removeClass("ui-state-hover");
        });
        $([IPython.events]).on('notebook_loaded.Notebook', function () {
            that.set_last_saved();
            that.update_notebook_name();
            that.update_document_title();
        });
        $([IPython.events]).on('notebook_saved.Notebook', function () {
            that.set_last_saved();
            that.update_notebook_name();
            that.update_url();
            that.update_document_title();
        });
        $([IPython.events]).on('notebook_auto_saved.Notebook', function () {
            that.set_last_saved();
        });
        $([IPython.events]).on('notebook_save_failed.Notebook', function () {
            that.set_save_status('');
        });
    };


    SaveWidget.prototype.rename_notebook = function () {
        var that = this;
        var dialog = $('<div/>');
        dialog.append(
            $('<h3/>').html('Enter a new notebook name:')
            .css({'margin-bottom': '10px'})
        );
        dialog.append(
            $('<input/>').attr('type','text').attr('size','25')
            .addClass('ui-widget ui-widget-content')
            .attr('value',IPython.notebook.get_notebook_name())
        );
        // $(document).append(dialog);
        dialog.dialog({
            resizable: false,
            modal: true,
            closeOnEscape: true,
            title: "Rename Notebook",
            closeText: "",
            close: function() {$(this).dialog('destroy').remove();},
            buttons : {
                "OK": function () {
                    var new_name = $(this).find('input').val();
                    if (!IPython.notebook.test_notebook_name(new_name)) {
                        $(this).find('h3').html(
                            "Invalid notebook name. Notebook names must "+
                            "have 1 or more characters and can contain any characters " +
                            "except / and \\. Please enter a new notebook name:"
                        );
                    } else {
                        IPython.notebook.set_notebook_name(new_name);
                        IPython.notebook.save_notebook(false);
                        $(this).dialog('close');
                    }
                },
                "Cancel": function () {
                    $(this).dialog('close');
                }
            }
        });
    }


    SaveWidget.prototype.update_notebook_name = function () {
        var nbname = IPython.notebook.get_notebook_name();
        this.element.find('span#notebook_name').html(nbname);
    };


    SaveWidget.prototype.update_document_title = function () {
        var nbname = IPython.notebook.get_notebook_name();
        document.title = nbname;
    };


    SaveWidget.prototype.update_url = function () {
        var notebook_id = IPython.notebook.get_notebook_id();
        var notebook_name = IPython.notebook.get_notebook_name();
        if (notebook_id !== null) {
            var new_url = $('body').data('baseProjectUrl') + 'view/' + encodeURIComponent(notebook_name) + '?id=' + notebook_id;
            window.history.replaceState({}, '', new_url);
        };
    };


    SaveWidget.prototype.set_save_status = function (msg) {
        this.element.find('span#save_status').html(msg);
    }


    SaveWidget.prototype.set_last_saved = function () {
        var user_time = IPython.notebook.get_user_save_timestamp();
        var user_string = ((user_time === undefined) ? 'Last saved by user: unknown' : 'Last saved by user: ' + user_time.format('mmm dd h:MM TT'));
        this.set_save_status(user_string);
    };


    IPython.SaveWidget = SaveWidget;

    return IPython;

}(IPython));
