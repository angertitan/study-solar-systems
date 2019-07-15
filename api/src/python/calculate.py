import numpy as np
import math
from functools import reduce
from constants import L_TERMS


def rad2deg(radians):
    return (180 / math.pi) * radians


def def2rad(degrees):
    return (math.pi / 180) * degrees


def limit_degrees_by_value(degrees, value):
    newDegrees = degrees / value
    limited = value * (newDegrees - math.floor(degrees))

    return limited


def limit_degrees_360(degrees):
    limited = limit_degrees_by_value(degrees, 360)

    if (limited < 0):
        correctedLimited = limited + 360
        return correctedLimited

    return limited


def limit_degrees_180(degrees):
    limited = limit_degrees_by_value(degrees, 180)

    if (limited < 0):
        correctedLimited = limited + 180
        return correctedLimited

    return limited


def limit_degrees_180pm(degrees):
    limited = limit_degrees_by_value(degrees, 360)

    if (limited > 180):
        correctedLimited = limited - 360
        return correctedLimited

    if (limited < -180):
        correctedLimited = limited + 360
        return correctedLimited

    return limited


def limit_zero_to_one(value):
    limited = value - math.floor(value)

    if (limited < 0):
        correctedLimited = limited + 1
        return correctedLimited

    return limited


def limit_minutes(minutes):
    if (minutes < -20):
        limited = minutes + 1440
        return limited

    if (minutes > 20):
        limited = minutes - 1440
        return limited

    return minutes


def day_frac_to_local_hr(dayfrac, timezone):
    return 24.0 * limit_zero_to_one(dayfrac + timezone / 24.0)


def third_order_polynomial(a, b, c, d, x):
    return ((a * x + b) * x + c) * x + d


def get_l0(jme):
    l0 = L_TERMS['L0']
    result = 0
    for r in l0:
        l1i = r['A'] * math.cos(r['B'] + r['C'] * jme)
        result += l1i

    return result


print(get_l0(0.0037927819916852264))