export class ConditionsBlock{
    complete: boolean = false;
    living_room_furniture: boolean = false;
    kitchen_furniture: boolean = false;
    couchette: boolean = false;
    bedding: boolean = false;
    dishes: boolean = false;
    refrigerator: boolean = false;
    washer: boolean = false;
    microwave_oven: boolean = false;
    air_conditioning: boolean = false;
    dishwasher: boolean = false;
    tv: boolean = false;
    with_animals: boolean = false;
    with_children: boolean = false;

    constructor (
        complete?: boolean,
        living_room_furniture?: boolean,
        kitchen_furniture?: boolean,
        couchette?: boolean,
        bedding?: boolean,
        dishes?: boolean,
        refrigerator?: boolean,
        washer?: boolean,
        microwave_oven?: boolean,
        air_conditioning?: boolean,
        dishwasher?: boolean,
        tv?: boolean,
        with_animals?: boolean,
        with_children?: boolean
    ) {
        this.complete = complete;
        this.living_room_furniture = living_room_furniture;
        this.kitchen_furniture = kitchen_furniture;
        this.couchette = couchette;
        this.bedding = bedding;
        this.dishes = dishes;
        this.refrigerator = refrigerator;
        this.washer = washer;
        this.microwave_oven = microwave_oven;
        this.air_conditioning = air_conditioning;
        this.dishwasher = dishwasher;
        this.tv = tv;
        this.with_animals = with_animals;
        this.with_children = with_children;
    }
}
