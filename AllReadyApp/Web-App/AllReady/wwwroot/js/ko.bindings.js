// knockout binding for jquery.maskedinput plugin
ko.bindingHandlers.masked = {
    init: function (element, valueAccessor) {
        var value = valueAccessor(),
            mask = ko.utils.unwrapObservable(value);
        $(element).mask(mask, { autoclear: false });
    }
};

// knockout binding for bootstrap accordion
ko.bindingHandlers.accordion = {
    init: function(elem, value, allBindings) {
        var options = ko.utils.unwrapObservable(value()) || {},
            toggleClass = "[data-toggle-accordion]",
            contentClass = ".collapse",
            openItem = parseInt(ko.utils.unwrapObservable(options.openItem)),
            itemClass = "." + (ko.utils.unwrapObservable(options.item) || "panel-group"),
            accordionDirectionIconClass = "." + (ko.utils.unwrapObservable(options.itemIconDirection) || "accordion-icon-direction"),
            items = $(elem).find(contentClass);

        initializeAccordion();

        // if the array is dynamic, the accordion should be re-initialized
        var list = (options.listSource) ? options.listSource : allBindings.get("foreach");
        if (ko.isObservable(list)) {
            list.subscribe(function() {
                initializeAccordion();
            });
        }

        $(elem).on("click", toggleClass, function (event) {
            $(elem).find(contentClass).collapse("hide");
            $(this).closest(itemClass).find(contentClass).collapse("show");
        });

        $(elem).on("show.bs.collapse", function (event) {
            toggleAccordionItemIconDirection(event);
        });

        $(elem).on("hide.bs.collapse", function (event) {
            toggleAccordionItemIconDirection(event);
        });

        // if initial open item specified, expand it
        if (openItem > -1) {
            items.eq(openItem).collapse("show");
        };

        function initializeAccordion() {
            // activate all items
            $(elem).find(contentClass).collapse({ parent: elem, toggle: false });
        }

        function toggleAccordionItemIconDirection(event) {
            var $currentPanel = $(event.target).closest(itemClass);
            var $accordionDirectionIcon = $currentPanel.find(accordionDirectionIconClass);

            $accordionDirectionIcon.toggleClass("fa-caret-down fa-caret-up");
        }
    }
};

// knockout binding for datepicker date
ko.bindingHandlers.dateTimePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().dateTimePickerOptions || {};
        $(element).datetimepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "dp.change", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                if (!event.date) {
                    value(null);
                }
                else if (event.date instanceof Date) {
                    console.log("instance of Date: " + event.date);
                    value(event.date);
                }
                else {
                    console.log(event.date.toDate());
                    value(event.date.toDate());
                }
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var picker = $(element).data("DateTimePicker");
            if (picker) {
                picker.destroy();
            }
        });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This is for input data binding only.
    }
};

// knockout binding for datepicker date
ko.bindingHandlers.dateRangePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        //initialize daterangepicker with some optional options
        var options = allBindingsAccessor().daterangepickerOptions || {};
        $(element).daterangepicker(options);

        //when a user changes the date, update the view model
        ko.utils.registerEventHandler(element, "apply.daterangepicker", function (event, picker) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                if (!picker.startDate || !picker.endDate) {
                    $(element).val('');
                    value(null);
                }
                else {
                    var format = options.locale.format;
                    var formattedDate = picker.startDate.format(format) + ' - ' + picker.endDate.format(format);
                    $(element).val(formattedDate);
                    var daterange = {
                        begin: picker.startDate,
                        end: picker.endDate,
                        formattedDate: formattedDate
                    };
                    value(daterange);
                }
            }
        });

        //when a user cancels the date, update the view model
        ko.utils.registerEventHandler(element, "cancel.daterangepicker", function (event, picker) {
            $(element).val('');
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(null);
            }
        });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            var picker = $(element).data('daterangepicker');
            if (picker) {
                picker.remove();
            }
        });
    }
};
