input.onButtonPressed(Button.A, function () {
    basic.clearScreen()
    pattern = 10
})
function モニタ () {
    serial.writeValue("0", pins.analogReadPin(AnalogPin.P0))
    serial.writeValue("1", pins.analogReadPin(AnalogPin.P1))
    serial.writeValue("2", pins.analogReadPin(AnalogPin.P2))
    serial.writeValue("line_pos", ライン位置())
    serial.writeLine("-------------------------------------------------")
}
function ライン位置 () {
    kp = 20
    kd = 20
    差分 = pins.analogReadPin(AnalogPin.P1) - pins.analogReadPin(AnalogPin.P2)
    微分 = 差分 - 前差分
    制御量 = 差分 * kp + 微分 * kd
    前差分 = 差分
    return 制御量
}
function 走る (スピード: number, 回転速度: number) {
    左スピード = スピード - 回転速度
    右スピード = スピード + 回転速度
    左モーター(左スピード)
    右モーター(右スピード)
}
input.onButtonPressed(Button.B, function () {
    basic.clearScreen()
    右モーター(0)
    左モーター(0)
    pattern = 20
})
function 左モーター (スピード: number) {
    左スピード = スピード
    if (左スピード >= 0) {
        pins.digitalWritePin(DigitalPin.P12, 0)
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P16, 0)
    }
    // 正転のリミット
    if (左スピード > 1024) {
        左スピード = 1023
    }
    // 逆転のリミット
    if (左スピード < -1023) {
        左スピード = -1023
    }
    // ブレーキ
    if (左スピード == 0) {
        pins.digitalWritePin(DigitalPin.P12, 1)
        pins.digitalWritePin(DigitalPin.P16, 1)
    } else {
        pins.analogWritePin(AnalogPin.P8, Math.abs(左スピード))
    }
}
function 右モーター (スピード: number) {
    右スピード = スピード
    if (右スピード >= 0) {
        pins.digitalWritePin(DigitalPin.P15, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P15, 1)
        pins.digitalWritePin(DigitalPin.P14, 0)
    }
    // 正転のリミット
    if (右スピード > 1024) {
        右スピード = 1023
    }
    // 逆転のリミット
    if (右スピード < -1023) {
        右スピード = -1023
    }
    // ブレーキ
    if (右スピード == 0) {
        pins.digitalWritePin(DigitalPin.P14, 1)
        pins.digitalWritePin(DigitalPin.P15, 1)
    } else {
        pins.analogWritePin(AnalogPin.P13, Math.abs(右スピード))
    }
}
function 右手 () {
    if (pins.analogReadPin(AnalogPin.P0) < 500) {
        basic.pause(10)
        if (pins.analogReadPin(AnalogPin.P0) < 500) {
            state = "on"
        }
    }
    if (pins.analogReadPin(AnalogPin.P0) > 600 && state == "on") {
        右手回数 += 1
        state = "off"
    }
    return 右手回数
}
let state = ""
let 右スピード = 0
let 左スピード = 0
let 制御量 = 0
let 前差分 = 0
let 微分 = 0
let 差分 = 0
let kd = 0
let kp = 0
let 右手回数 = 0
let pattern = 0
basic.showLeds(`
    . # # # .
    . . # . .
    . . # . .
    # . # . .
    . # . . .
    `)
右モーター(0)
左モーター(0)
pattern = 0
右手回数 = 0
basic.forever(function () {
    if (pattern == 10) {
        if (右手回数 == 3) {
            pattern = 100
        }
        右手()
        走る(700, ライン位置())
    }
    if (pattern == 20) {
        serial.writeValue("n", 右手())
        モニタ()
        basic.pause(500)
    }
    if (pattern == 30) {
        serial.writeValue("n", 右手())
    }
    if (pattern == 100) {
        右モーター(0)
        左モーター(0)
    }
})
