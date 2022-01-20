use std::fs;
use std::time::Instant;

#[derive(Copy, Clone, Debug, PartialEq)]
struct GridSpot {
    arrival_cost: u32,
    cost_from_origin: u32,
    visited: bool,
}

const HIGH_COST: u32 = 1000000;

fn main() {
    // Parse file input
    let file_content = fs::read_to_string("i.txt").expect("Something went wrong reading the file");

    // Split to different input sets
    let inputs: Vec<&str> = file_content.split("\n***\n").collect();

    // Perform functions on each input set
    for input in inputs.iter() {
        // Time measure
        let start = Instant::now();
        println!("P1");
        p1(input);
        let duration = start.elapsed();
        println!("Time elapsed: {:?}", duration);

        let start = Instant::now();
        println!("P2");
        p2(input);
        let duration = start.elapsed();
        println!("Time elapsed: {:?}", duration);
    }
}

fn p2(input: &str) {
    let mut tiled_input: Vec<Vec<u32>> = input
        .split('\n')
        .map(|r| {
            r.chars()
                .map(|c| c.to_digit(10).expect("Grid should be numbers"))
                .collect()
        })
        .collect();

    let mut vertical_addition: Vec<Vec<u32>> = vec![];
    for add in 1..5 {
        for row in tiled_input.iter() {
            let clone = row
                .iter()
                .map(|c| {
                    if (c + add) >= 10 {
                        c + add - 9
                    } else {
                        c + add
                    }
                })
                .collect();
            vertical_addition.push(clone);
        }
    }
    tiled_input.append(&mut vertical_addition);

    tiled_input = tiled_input
        .iter()
        .map(|r| {
            let mut new_row: Vec<u32> = vec![];
            for add in 0..5 {
                let mut clone: Vec<u32> = r
                    .iter()
                    .map(|c| {
                        if (c + add) >= 10 {
                            c + add - 9
                        } else {
                            c + add
                        }
                    })
                    .collect();
                new_row.append(&mut clone)
            }
            return new_row;
        })
        .collect();

    let stringified_input = tiled_input
        .iter()
        .map(|r| {
            r.iter()
                .map(|c| c.to_string())
                .collect::<Vec<String>>()
                .concat()
                + &String::from("\n")
        })
        .collect::<Vec<String>>()
        .concat();

    p1(&stringified_input);
}

fn p1(input: &str) {
    // Translate set of strings to useful array of spots / structs
    let mut chars: Vec<char> = input.chars().collect();
    chars.retain(|&x| x != '\n');
    let mut grid: Vec<GridSpot> = chars
        .iter()
        .map(|c| GridSpot {
            visited: false,
            arrival_cost: c.to_digit(10).expect("Grid should be numbers"),
            cost_from_origin: HIGH_COST,
        })
        .collect();
    grid[0].cost_from_origin = 0;

    let grid_limit = grid.len();

    let row_length = match grid_limit {
        16 => 4,
        25 => 5,
        625 => 25,
        100 => 10,
        2500 => 50,
        10000 => 100,
        250000 => 500,
        _ => 1,
    };

    // Loop performing djikstra's until we find spot
    loop {
        // Find unvisited node with lowest potential cost
        // tuple: (index, cost)
        let min_index = grid
            .iter()
            .enumerate()
            .fold((0, HIGH_COST), |a, (i, x)| {
                if !x.visited && x.cost_from_origin < a.1 {
                    return (i, x.cost_from_origin);
                } else {
                    return a;
                }
            })
            .0;

        let current = grid
            .get_mut(min_index)
            .expect("Current must be a grid spot");
        current.visited = true;

        if min_index == grid_limit - 1 {
            println!("Cheapest path cost is {}", current.cost_from_origin);
            break;
        }

        let base_cost = current.cost_from_origin;

        if min_index % row_length < row_length - 1 {
            let right = grid.get_mut(min_index + 1);
            if let Some(right_spot) = right {
                if !right_spot.visited {
                    right_spot.cost_from_origin = right_spot
                        .cost_from_origin
                        .min(base_cost + right_spot.arrival_cost);
                }
            }
        }

        let down = grid.get_mut(min_index + row_length);
        if let Some(down_spot) = down {
            if !down_spot.visited {
                down_spot.cost_from_origin = down_spot
                    .cost_from_origin
                    .min(base_cost + down_spot.arrival_cost);
            }
        }

        if min_index >= 1 && min_index % row_length > 0 {
            let left = grid.get_mut(min_index - 1);
            if let Some(left_spot) = left {
                if !left_spot.visited {
                    left_spot.cost_from_origin = left_spot
                        .cost_from_origin
                        .min(base_cost + left_spot.arrival_cost);
                }
            }
        }

        if min_index >= row_length {
            let up = grid.get_mut(min_index - row_length);
            if let Some(up_spot) = up {
                if !up_spot.visited {
                    up_spot.cost_from_origin = up_spot
                        .cost_from_origin
                        .min(base_cost + up_spot.arrival_cost);
                }
            }
        }
    }
    // for row in 0..row_length {
    //     for col in 0..row_length {
    //         let val = if grid
    //             .get(col + row * row_length)
    //             .expect("should be valid spot")
    //             .visited
    //         {
    //             1
    //         } else {
    //             0
    //         };
    //         print!("{}", val);
    //     }
    //     print!("\n")
    // }
}
