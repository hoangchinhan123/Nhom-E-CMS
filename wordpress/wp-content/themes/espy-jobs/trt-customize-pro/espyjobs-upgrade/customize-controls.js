(function (api) {
  // Extends our custom "espyjobs-upgrade" section.
  api.sectionConstructor["espyjobs-upgrade"] = api.Section.extend({
    // No events for this type of section.
    attachEvents: function () {},

    // Always make the section active.
    isContextuallyActive: function () {
      return true;
    },
  });
})(wp.customize);
