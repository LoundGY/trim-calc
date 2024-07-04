(function ($) {
  $.fn.selectbox = function () {
    let selectDefaultHeight = $('.selectboxss').height();
    let menuHeight = $('.selectboxssmenu').height() + 36;
    $('.selectboxss .selectboxssvalue').click(function () {
      let currentHeight = $(this).closest('.selectboxss').height();
      if (currentHeight < 100 || currentHeight == selectDefaultHeight) {
        $(this)
          .closest('.selectboxss')
          .height(menuHeight + 'px');
        $(this)
          .find('.arrowselect')
          .attr(
            'style',
            'transition: 0.2s;transform: rotate(180deg);padding: 0px 0px 13px 13px;'
          );
      }
      if (currentHeight >= 50) {
        $(this).closest('.selectboxss').height(selectDefaultHeight);
        $(this)
          .find('.arrowselect')
          .attr('style', 'rotate(0deg);padding: 13px 13px 0px 0px;');
      }
    });
    $('li.selectoption').click(function () {
      $(this).closest('.selectboxss').height(selectDefaultHeight);
      $(this)
        .closest('.selectboxss')
        .find('.arrowselect')
        .attr('style', 'rotate(0deg);padding: 13px 13px 0px 0px;');
      $(this)
        .closest('.selectboxss')
        .find('.selectboxssvalue input')
        .val($(this).text());
      $(this)
        .closest('.selectboxss')
        .find('.selectboxssvalue input')
        .attr('data-seaId', $(this).attr('data-seaId'));
      $('#currentSea').change();
    });
  };
})(jQuery);
$(document).ready(function () {
  Seacraft.init();
});

new PerfectScrollbar('#accessories1', {
  maxScrollbarLength: 109,
  minScrollbarLength: 70,
  useBothWheelAxes: true,
  scrollingThreshold: 5000,
  wheelSpeed: 0.5,
});
new PerfectScrollbar('#accessories2', {
  maxScrollbarLength: 109,
  minScrollbarLength: 70,
  useBothWheelAxes: true,
  scrollingThreshold: 5000,
  wheelSpeed: 0.5,
});
new PerfectScrollbar('#accessories3', {
  maxScrollbarLength: 109,
  minScrollbarLength: 70,
  useBothWheelAxes: true,
  scrollingThreshold: 5000,
  wheelSpeed: 0.5,
});
const models = JSON.parse(
  $.getJSON({ url: '/trim-calculator-template/data/models.json', async: false }).responseText
);
const words = JSON.parse(
  $.getJSON({ url: '/trim-calculator-template/data/words.json', async: false }).responseText
)[language];
const acces = JSON.parse(
  $.getJSON({ url: '/trim-calculator-template/data/accessories.json', async: false }).responseText
);
const seas = JSON.parse(
  $.getJSON({ url: '/trim-calculator-template/data/sea.json', async: false }).responseText
);
let brackets = [[], [], []];
let activeConfig = 'A';
const configs = { A: {}, B: {} };
let Seacraft = {
  config: {
    selectConfig: function (config) {
      activeConfig = config;
      Seacraft.scooter.reset();
      if (config === 'B') {
        $('.model').css('display', 'none');
      } else {
        $('.model').css('display', 'flex');
      }
      const currentConfig = JSON.parse(JSON.stringify(configs.A));
      const scooterModel = configs.A.scooter;
      if (config === 'A') {
        $(`li.selectoption[data-seaId=${currentConfig.sea}]`).click();
      }
      if (scooterModel !== undefined) {
        $('.model__title')[scooterModel].click();
        const access = currentConfig['accessories'];
        if (access?.length) {
          access.sort((a, b) => a.id - b.id);
          access.forEach((ac) => {
            $('#accessories' + ac.point)
              .find('.acc[data-id=' + ac.id + ']')
              .addClass('active-access');
            $('#accessories' + ac.point)
              .find('.bracket[data-id=' + ac.id + ']')
              .addClass('active-access');
            Seacraft.accessories.choise1(ac.point, ac.id);
          });
        }
      } else {
        $('.model__title')[0].click();
      }
      Seacraft.countBuoyancy();
    },
    saveConfig: function () {
      let acs = Array.from($('#accesory').find('img'));
      let brs = Array.from($('#bracket').find('img'));
      const activeAccess = [];
      acs.forEach((item) => {
        activeAccess.push({
          id: $(item).attr('data-id'),
          point: $(item).attr('data-point'),
        });
      });
      brs.forEach((item) => {
        activeAccess.push({
          id: $(item).attr('data-id'),
          point: $(item).attr('data-point'),
        });
      });

      const active_scooter_id = $('.models')
        .find('.model__active')
        .attr('data-id');
      const config = {
        scooter: +active_scooter_id,
        accessories: activeAccess,
        sea: $('#currentSea').attr('data-seaid'),
        currentBuoyancy: +$('#current-buouancy').text(),
      };
      if (activeConfig === 'B') {
        config.accessories = [];
      }
      configs[activeConfig] = config;
      if (activeConfig === 'B') {
        /* 
        $('.trimmed-block').css('display', 'flex'); */
        $('#trimmed-buouancy').text(
          configs.A.currentBuoyancy ? configs.A.currentBuoyancy : 0
        );
      } else {
        /* 
        $('.trimmed-block').css('display', 'none'); */
      }
    },
  },
  countBuoyancy: function () {
    let waterDensity = Math.round(
      1000 +
        28.152 -
        0.0735 * Number($('#seaTemp').val()) -
        0.00469 * Math.pow(Number($('#seaTemp').val()), 2) +
        (0.802 - 0.002 * Number($('#seaTemp').val())) *
          (Number($('#seaSalt').val()) - 35)
    );
    const active_scooter_id = $('.models')
      .find('.model__active')
      .attr('data-id');
    if (active_scooter_id == undefined) {
      return;
    }
    if (active_scooter_id < 2) {
      $('#no_go_ballast').css('display', 'flex');
      $('#go_ballast').css('display', 'none');
    } else {
      $('#no_go_ballast').css('display', 'none');
      $('#go_ballast').css('display', 'flex');
    }
    let scooter_weight = models[active_scooter_id].weight * 1000,
      scooter_volume = (models[active_scooter_id].weight / 0.998) * 1000;
    let scooter_buoyancy = +(
      (Number(scooter_volume) * Number(waterDensity)) /
      1000
    ).toFixed(3);
    let acc_weight = 0;
    let acc_buoyancy = 0;
    let acs = Array.from($('#accesory').find('img'));
    let brs = Array.from($('#bracket').find('img'));
    for (let i = 0; i < acs.length; i++) {
      let myAccessry = acces.find((obj) => {
        return obj.id == $(acs[i]).attr('data-id');
      });
      acc_weight += Number(myAccessry.weight);
      acc_buoyancy += Number(myAccessry.buoyancyFresh);
    }
    let brW = 0;
    for (let i = 0; i < brs.length; i++) {
      let myAccessry = acces.find((obj) => {
        return obj.id == $(brs[i]).attr('data-id');
      });
      brW += Number(myAccessry.weight);
      acc_weight += Number(myAccessry.weight);
      acc_buoyancy += Number(myAccessry.buoyancyFresh);
    }
    acc_buoyancy *= waterDensity / 1000;
    let scooter_weight_with_acces = Number(scooter_weight) + Number(acc_weight),
      scooter_buoyancy_with_acces =
        Number(scooter_buoyancy) + Number(acc_buoyancy);
    let currentBuoy = scooter_weight_with_acces - scooter_buoyancy_with_acces;
    if (activeConfig === 'B') {
      currentBuoy += configs.A.currentBuoyancy;
    }
    $('#current-buouancy').text(Math.round(-currentBuoy));
    let internalBallastToAdd = -currentBuoy;
    let Internal1mmPlateWeight = 65,
      Internal3mmPlateWeight = 200,
      InternalPlateWeightForGo = 52.5;
    let internal3mmPlates = Math.trunc(
      internalBallastToAdd / Internal3mmPlateWeight
    );
    let internalPlatesForGo = Math.trunc(
      internalBallastToAdd / InternalPlateWeightForGo
    );
    let internal1mmPlates = Math.round(
      (internalBallastToAdd - internal3mmPlates * Internal3mmPlateWeight) /
        Internal1mmPlateWeight
    );
    if (Math.round(currentBuoy) > 0 && Math.round(currentBuoy) <= 100) {
      let foamSetNetWeight = 105,
        seacraftBeltNetWeight = 20;
      let foamPieces = Math.abs(
        Math.round(
          (-currentBuoy + seacraftBeltNetWeight) / (foamSetNetWeight / 3)
        )
      ); //C65
      if (foamPieces > 3) {
        foamPieces = 3;
      }
      //foam delete
      if (false && foamPieces > 0 && active_scooter_id < 2) {
        $('#foam-block').html('');
        $('#foam-block').append(
          '<span class="first-part-of-text">Or add:</span><div class="foam-parts"><div class="foam__quan"><span id="foam-weight"></span>g (<span id="foam-quan"></span>/3)</div><img src="/trim-calculator-template/assets/images/icons/foam.png" alt=""><div class="foam__with">foam with</div><img src="/trim-calculator-template/assets/images/icons/belt.png" alt=""></div>'
        );
        $('#foam-quan').text(foamPieces);
        $('#foam-weight').text(35 * foamPieces - 20);
        $('#foam-block').css('display', 'flex');
      } else {
        $('#foam-block').html('');
        $('#foam-block').css('display', 'none');
      }
    } else {
      $('#foam-block').html('');
      $('#foam-block').css('display', 'none');
    }
    if (Math.round(currentBuoy) < 0) {
      $('#ballastMove').text(words.Add_ballast);
    } else {
      $('#ballastMove').text(words.Remove_ballast);
    }
    $('#detail61').text(Math.abs(internal1mmPlates));
    $('#detail200').text(Math.abs(internal3mmPlates));
    $('#detail52').text(Math.abs(internalPlatesForGo));
    Seacraft.config.saveConfig();
  },
  sea: {
    load: function () {
      seas.forEach((element, index) => {
        $('#seas').append(
          '<li class="selectoption" data-seaId=' +
            index +
            '>' +
            element[language + 'Name'] +
            '</li>'
        );
      });
      $('.selectboxss').selectbox();
      $('#currentSea').change(function () {
        $('#seaSalt').val(seas[$('#currentSea').attr('data-seaId')].salt);
        $('#seaTemp').val(
          seas[$('#currentSea').attr('data-seaId')].temperature
        );
        Seacraft.countBuoyancy();
      });
      let minSalt = 0,
        maxSalt = 40,
        minTemp = 0,
        maxTemp = 35;
      $('#seaSalt').change(function () {
        $('#currentSea').val(seas[seas.length - 1][language + 'Name']);
        if ($('#seaSalt').val() > maxSalt) {
          $('#seaSalt').val(maxSalt);
        } else if ($('#seaSalt').val() < minSalt) {
          $('#seaSalt').val(minSalt);
        } else if (isNaN($('#seaSalt').val())) {
          $('#seaSalt').val(minSalt);
        }
        Seacraft.countBuoyancy();
      });
      $('#seaTemp').change(function () {
        $('#currentSea').val(seas[seas.length - 1][language + 'Name']);
        if ($('#seaTemp').val() > maxTemp) {
          $('#seaTemp').val(maxTemp);
        } else if ($('#seaTemp').val() < minTemp) {
          $('#seaTemp').val(minTemp);
        } else if (isNaN($('#seaTemp').val())) {
          $('#seaTemp').val(minTemp);
        }
        Seacraft.countBuoyancy();
      });
      $('li.selectoption[data-seaId=7]').click();
    },
  },
  scooter: {
    load: function () {
      models.forEach((element, index) => {
        $('#models').append(
          '<span class="model__title" data-id="' +
            index +
            '">' +
            element.model +
            '</span>'
        );
      });
      $('#reset').click(() => {
        Seacraft.scooter.reset();
        configs[activeConfig]['accessories'] = [];
      });
      $('.model__title').click(function () {
        $('.models').find('.model__active').removeClass('model__active');
        $(this).addClass('model__active');
        Seacraft.scooter.select($(this).attr('data-id'));
      });
      $('.button').click(function () {
        $('.scooter-points').find('.active-btn').removeClass('active-btn');
        $(this).addClass('active-btn');
        $('.mainblock__accessories')
          .find('.accessories_active')
          .removeClass('accessories_active');
        $('#accessories' + $(this).attr('data-point')).addClass(
          'accessories_active'
        );
      });
      $('.model__title')[0].click();
    },
    reset: function () {
      $('#bracket').empty();
      $('#accesory').empty();
      $('.accessories')
        .find('.accessories__items')
        .removeClass('active-access');
      Seacraft.countBuoyancy();
    },
    select: function (scooter) {
      $('#modelIMG').remove();
      $('#model').append(
        $('<img>', {
          id: 'modelIMG',
          src: '../' + models[scooter].img,
        })
      );
      Seacraft.accessories.load(scooter);
      $('#model').empty();
      $('#bracket').empty();
      $('#accesory').empty();
      $('#scooter-weight').text(new Intl.NumberFormat(language).format(models[scooter].weight));
      $('#model').append(
        $('<img>', {
          id: 'modelIMG',
          src: '../' + models[scooter].img,
        })
      );
      if (scooter < 2) {
        $('#no_go_ballast').css('display', 'flex');
        $('#go_ballast').css('display', 'none');
        $('.button[data-point="2"]').show();
      } else {
        $('#no_go_ballast').css('display', 'none');
        $('#go_ballast').css('display', 'flex');
        $('.button[data-point="1"]').click();
        $('.button[data-point="2"]').hide();
      }

      Seacraft.config.saveConfig();
      Seacraft.countBuoyancy();
    },
  },
  accessories: {
    load: function (modelID) {
      $('#accessories1').html('');
      $('#accessories2').html('');
      $('#accessories3').html('');
      brackets[0] = [];
      brackets[1] = [];
      brackets[2] = [];
      models[modelID].accessories.forEach((element, index) => {
        acces.forEach((el) => {
          if (el.id == element) {
            const codePrev = '<b>[' + el.code + ']</b>';
            const code =
              codePrev +
              (el.url
                ? '<br><a href="' +
                  el.url +
                  '" target="_blank">' +
                  'Details' +
                  '</a>'
                : '');
            let acs =
              '<div class="items-image"><img src="/trim-calculator-template/assets/images/accessory/icons/' +
              el.img +
              '.png" alt=""></div><div div class="items-name"><span>' +
              el[language + 'Name'] +
              '<br>' +
              code +
              '</span></div>';
            if (el.point1 == '1') {
              if (el.bracket == true) {
                brackets[0].push(el);
              }
              $('<div />', {
                class:
                  'accessories__items ' +
                  (el.bracket == true ? 'bracket' : 'acc'),
                'data-id': el.id,
                html: acs,
              }).appendTo('#accessories1');
            }
            if (el.point2 == '1') {
              if (el.bracket == true) {
                brackets[1].push(el);
              }
              $('<div />', {
                class:
                  'accessories__items ' +
                  (el.bracket == true ? 'bracket' : 'acc'),
                'data-id': el.id,
                html: acs,
              }).appendTo('#accessories2');
            }
            if (el.point3 == '1') {
              if (el.bracket == true) {
                brackets[2].push(el);
              }
              $('<div />', {
                class:
                  'accessories__items ' +
                  (el.bracket == true ? 'bracket' : 'acc'),
                'data-id': el.id,
                html: acs,
              }).appendTo('#accessories3');
            }
          }
        });
      });
      $('.accessories__items').click(function () {
        if ($(this).hasClass('active-access')) {
          $(this).removeClass('active-access');
          Seacraft.accessories.choise1(
            $(this).parent().attr('data-access'),
            $(this).attr('data-id'),
            false
          );
          Seacraft.countBuoyancy();
        } else {
          $(this).addClass('active-access');
          Seacraft.accessories.choise1(
            $(this).parent().attr('data-access'),
            $(this).attr('data-id'),
            true,
            $(this)
          );
          Seacraft.countBuoyancy();
        }
      });
    },
    choise1: function (point, id, type = true, elems = null, tool = true) {
      //type: true-add, false-remove, tool is for access with required brackets: when true - get tooltip/false-remove all access at this point
      let myAccessry = acces.find((obj) => {
        return obj.id == id;
      });
      if (type == false) {
        if (myAccessry.bracket == true) {
          $('.bracket' + point + 'IMG' + '[data-id=' + id + ']').remove();
          let elem = $('#accesory').find('.accessory' + point + 'IMG');
          $('#accesory')
            .find('.accessory' + point + 'IMG')
            .remove();
          for (let i = 0; i < elem.length; i++) {
            let interimAccs = acces.find((obj) => {
              return obj.id == $(elem[i]).attr('data-id');
            });
            if (interimAccs.with.length > 0) {
              interimAccs.with.forEach((elemWith) => {
                $('#accesory')
                  .find('[data-id=' + elemWith + ']')
                  .remove();
                Seacraft.accessories.choise1(
                  point,
                  $(elem[i]).attr('data-id'),
                  true,
                  elems,
                  false
                );
              });
            } else {
              Seacraft.accessories.choise1(
                point,
                $(elem[i]).attr('data-id'),
                true,
                elems,
                false
              );
            }
          }
        } else {
          $('.accessory' + point + 'IMG' + '[data-id=' + id + ']').remove();
        }
      } else {
        if (myAccessry.bracket == true) {
          $('#' + $(elems).parent().attr('id'))
            .find('.bracket')
            .removeClass('active-access');
          $('.bracket' + point + 'IMG').remove();
          $(elems).addClass('active-access');
          $('#bracket').append(
            $('<img>', {
              class: 'bracket' + point + 'IMG',
              'data-id': id,
              'data-point': point,
              src:
                '/trim-calculator-template/assets/images/accessory/models/' +
                $('.models').find('.model__active').attr('data-id') +
                '/bracket/point' +
                point +
                '/' +
                myAccessry.img +
                '.png',
            })
          );
          let elem = $('#accesory').find('.accessory' + point + 'IMG');
          $('#accesory')
            .find('.accessory' + point + 'IMG')
            .remove();
          for (let i = 0; i < elem.length; i++) {
            let interimAccs = acces.find((obj) => {
              return obj.id == $(elem[i]).attr('data-id');
            });
            if (interimAccs.with.length > 0) {
              interimAccs.with.forEach((elemWith) => {
                $('#accesory')
                  .find('[data-id=' + elemWith + ']')
                  .remove();
                Seacraft.accessories.choise1(
                  point,
                  $(elem[i]).attr('data-id'),
                  true,
                  elems,
                  false
                );
              });
            } else {
              Seacraft.accessories.choise1(
                point,
                $(elem[i]).attr('data-id'),
                true,
                elems,
                false
              );
            }
          }
        } else {
          if (myAccessry.withBracket == false) {
            $('.bracket' + point + 'IMG').remove();
          } else if (myAccessry.withBracket == true) {
            if ($('.bracket' + point + 'IMG').length < 1) {
              if (tool == false) {
                $('#accessories' + point)
                  .find('.acc[data-id=' + myAccessry.id + ']')
                  .removeClass('active-access');
                $(
                  '.accessory' +
                    point +
                    'IMG' +
                    '[data-id=' +
                    myAccessry.id +
                    ']'
                ).remove();
              } else {
                let htmlTool =
                  '<div class="title-tool">' +
                  words.words.selectBracket +
                  '</div>';
                tippy(elems[0], {
                  arrow: false,
                  content: htmlTool,
                  trigger: 'click',
                  hideOnClick: true,
                  showOnCreate: true,
                  interactive: true,
                  maxWidth: 'none',
                  allowHTML: true,
                  placement: 'top',
                  zIndex: 9999,
                  onHidden(instance) {
                    $('.mainblock__accessories')
                      .find(`[data-tippy-root]`)
                      .remove();
                    elems[0]._tippy?.destroy();
                  },
                  onClickOutside() {
                    $(elems[0]).removeClass('active-access');
                    elems[0]._tippy?.destroy();
                  },
                });
              }
              return;
            }
          }
          let elem = $('#accesory').find('.accessory' + point + 'IMG');
          let path = '';
          if ($('.bracket' + point + 'IMG').length > 0) {
            path = '/bracket/';
          } else {
            path = '/';
          }
          let counter = 0;
          let someAcc = $('#' + $(elems).parent().attr('id')).find(
            '.active-access'
          );
          if (elem.length > 0) {
            for (let i = 0; i < elem.length; i++) {
              let myAccess = acces.find((obj) => {
                return obj.id == elem[i].dataset.id;
              });
              if (myAccess.mix.includes(Number(id)) || myAccess.id == id) {
                counter++;
              } else {
                $(
                  '#accesory .accessory' +
                    point +
                    'IMG[data-id=' +
                    elem[i].dataset.id +
                    ']'
                ).remove();

                $('#accessories' + point)
                  .find('.acc[data-id=' + elem[i].dataset.id + ']')
                  .removeClass('active-access');
              }
            }
            if (counter == elem.length) {
              $('#accesory').append(
                $('<img>', {
                  class: 'accessory' + point + 'IMG',
                  'data-id': id,
                  'data-point': point,
                  src:
                    '/trim-calculator-template/assets/images/accessory/models/' +
                    $('.models').find('.model__active').attr('data-id') +
                    path +
                    'point' +
                    point +
                    '/' +
                    myAccessry.img +
                    '.png',
                })
              );
            } else {
              for (let i = 0; i < someAcc.length; i++) {
                let zxc = acces.find((obj) => {
                  return obj.id == $(someAcc[i]).attr('data-id');
                });
                if (zxc.with.length > 0) {
                  zxc.with.forEach((el) => {
                    let abc = acces.find((obj) => {
                      return obj.id == el;
                    });
                    if (abc.point1 == '1') {
                      Seacraft.accessories.choiseWithSecond(1, el, false);
                    } else if (abc.point2 == '1') {
                      Seacraft.accessories.choiseWithSecond(2, el, false);
                    } else {
                      Seacraft.accessories.choiseWithSecond(3, el, false);
                    }
                  });
                }
              }
              $(elems).addClass('active-access');
              $('#accesory').append(
                $('<img>', {
                  class: 'accessory' + point + 'IMG',
                  'data-id': id,
                  'data-point': point,
                  src:
                    '/trim-calculator-template/assets/images/accessory/models/' +
                    $('.models').find('.model__active').attr('data-id') +
                    path +
                    'point' +
                    point +
                    '/' +
                    myAccessry.img +
                    '.png',
                })
              );
            }
          } else {
            $('#accesory').append(
              $('<img>', {
                class: 'accessory' + point + 'IMG',
                'data-id': id,
                'data-point': point,
                src:
                  '/trim-calculator-template/assets/images/accessory/models/' +
                  $('.models').find('.model__active').attr('data-id') +
                  path +
                  'point' +
                  point +
                  '/' +
                  myAccessry.img +
                  '.png',
              })
            );
          }
        }
      }
      if (myAccessry.with.length > 0) {
        myAccessry.with.forEach((el) => {
          let secondAccess = acces.find((obj) => {
            return obj.id == el;
          });
          if (secondAccess.point1 == '1') {
            Seacraft.accessories.choiseWithSecond(1, el, type);
          } else if (secondAccess.point2 == '1') {
            Seacraft.accessories.choiseWithSecond(2, el, type);
          } else {
            Seacraft.accessories.choiseWithSecond(3, el, type);
          }
        });
      }
      Seacraft.config.saveConfig();
      Seacraft.countBuoyancy();
    },
    choiseWithSecond: function (
      point,
      id,
      type = true,
      elems = null,
      tool = true
    ) {
      let myAccessry = acces.find((obj) => {
        return obj.id == id;
      });
      if (type == true) {
        $('#accessories' + point)
          .find('.acc[data-id=' + id + ']')
          .addClass('active-access');
        let elem = $('#accesory').find('.accessory' + point + 'IMG');
        let path = '';
        if ($('.bracket' + point + 'IMG').length > 0) {
          path = '/bracket/';
        } else {
          path = '/';
        }
        let counter = 0;
        if (elem.length > 0) {
          for (let i = 0; i < elem.length; i++) {
            let myAccess = acces.find((obj) => {
              return obj.id == elem[i].dataset.id;
            });
            if (myAccess.mix.includes(Number(id)) || myAccess.id == id) {
              counter++;
            } else {
              $('#accessories' + point)
                .find('.acc[data-id=' + elem[i].dataset.id + ']')
                .removeClass('active-access');
            }
          }
          if (counter == elem.length) {
            $('#accesory').append(
              $('<img>', {
                class: 'accessory' + point + 'IMG',
                'data-id': id,
                'data-point': point,
                src:
                  '/trim-calculator-template/assets/images/accessory/models/' +
                  $('.models').find('.model__active').attr('data-id') +
                  path +
                  'point' +
                  point +
                  '/' +
                  myAccessry.img +
                  '.png',
              })
            );
          } else {
            let someAcc = $('#accesory .accessory' + point + 'IMG');

            for (let i = 0; i < someAcc.length; i++) {
              if (
                !myAccessry.mix.includes(Number($(someAcc[i]).attr('data-id')))
              ) {
                $(
                  '#accesory .accessory' +
                    point +
                    'IMG[data-id=' +
                    $(someAcc[i]).attr('data-id') +
                    ']'
                ).remove();
              }
            }

            $('#' + $(elems).parent().attr('id'))
              .find('.acc')
              .removeClass('active-access');
            $(elems).addClass('active-access');

            $('#accesory').append(
              $('<img>', {
                class: 'accessory' + point + 'IMG',
                'data-id': id,
                'data-point': point,
                src:
                  '/trim-calculator-template/assets/images/accessory/models/' +
                  $('.models').find('.model__active').attr('data-id') +
                  path +
                  'point' +
                  point +
                  '/' +
                  myAccessry.img +
                  '.png',
              })
            );
          }
        } else {
          $('#accesory').append(
            $('<img>', {
              class: 'accessory' + point + 'IMG',
              'data-id': id,
              'data-point': point,
              src:
                '/trim-calculator-template/assets/images/accessory/models/' +
                $('.models').find('.model__active').attr('data-id') +
                path +
                'point' +
                point +
                '/' +
                myAccessry.img +
                '.png',
            })
          );
        }
      } else {
        $('#accessories' + point)
          .find('.acc[data-id=' + id + ']')
          .removeClass('active-access');
        $('.accessory' + point + 'IMG' + '[data-id=' + id + ']').remove();
      }
    },
  },
  howtouse: function () {
    $('<div />', {
      class: 'modal',
    }).appendTo('body');
    $('<div />', {
      class: 'htuCard',
    }).appendTo('.modal');
    $('<div />', {
      class: 'htuCard__title',
      html: words.how.title,
    }).appendTo('.htuCard');
    $('<div />', {
      class: 'htuCard__text',
      html: words.how.about,
    }).appendTo('.htuCard');
    $('<div />', {
      class: 'htuCard__сlose',
      html: '×',
      click: function () {
        $('.modal').remove();
      },
    }).appendTo('.htuCard');

    $(document).mouseup(function (e) {
      var container = $('.modal');
      if (container.has(e.target).length === 0) {
        $('.modal').remove();
      }
    });
  },
  translate: function () {
    const translatedWords = words.words;
    $('#words-title').text(translatedWords.title);
    $('#selectA').text(translatedWords.isTrimmed);
    $('#selectB').text(translatedWords.cancel);
    $('.howtouse__title').text(translatedWords.howToUse);
    $('.model__main').text(translatedWords.model);
    $('.waterParam span').text(translatedWords.waterParameters);
    $('.waterParameters').eq(0).find('span').eq(0).text(translatedWords.salt);
    $('.waterParameters').eq(1).find('span').eq(0).text(translatedWords.temp);
    $('.weight .first-part-of-text').text(translatedWords['Dry weight of DPV']);
    $('.weight .right__span2').text(
      translatedWords['Neutral buoyancy in fresh water']
    );
    $('#ballastMove').text(translatedWords['Remove ballast']);
    $('.scooter-points .title').text(translatedWords['Choose mounting point']);
    $('#reset').text(translatedWords['Reset all']);
    $('#current-buoyancy').text(translatedWords['Current buoyancy']);
    $('#accessories-title').text(translatedWords['Accessories']);

    if ($(window).width() < 705) {
      $('.button:eq(0)').text(translatedWords['point'] + ' 1');
      $('.button:eq(1)').text(translatedWords['point'] + ' 2');
      $('.button:eq(2)').text(translatedWords['point'] + ' 3');
    } else {
      $('.button:eq(0)').text(translatedWords['Mounting point'] + ' 1');
      $('.button:eq(1)').text(translatedWords['Mounting point'] + ' 2');
      $('.button:eq(2)').text(translatedWords['Mounting point'] + ' 3');
    }
    $(window).resize(function () {
      if ($(window).width() < 705) {
        $('.button:eq(0)').text(translatedWords['point'] + ' 1');
        $('.button:eq(1)').text(translatedWords['point'] + ' 2');
        $('.button:eq(2)').text(translatedWords['point'] + ' 3');
      } else {
        $('.button:eq(0)').text(translatedWords['Mounting point'] + ' 1');
        $('.button:eq(1)').text(translatedWords['Mounting point'] + ' 2');
        $('.button:eq(2)').text(translatedWords['Mounting point'] + ' 3');
      }
    });
  },
  init: function () {
    Seacraft.scooter.load();
    Seacraft.sea.load();
    $('#howtouse').click(function () {
      Seacraft.howtouse();
    });
    $('#selectA').click(function () {
      $('#selectB').addClass('active');
      $(this).removeClass('active');
      Seacraft.config.selectConfig('B');
    });
    $('#selectB').click(function () {
      $('#selectA').addClass('active');
      $(this).removeClass('active');
      Seacraft.config.selectConfig('A');
    });
    Seacraft.translate();
  },
};
