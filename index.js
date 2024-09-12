async function get_future_contests(){
    let result = await fetch('https://codeforces.com/api/contest.list?gym=false');
    let json = await result.json();
    let contest_list = json.result;
    contest_list = contest_list.filter(contest => contest.relativeTimeSeconds < 0);
    return contest_list;
}
function ending(n){
    const second_to_last = Math.floor(n/10)%10;
    const last = n%10;
    if(second_to_last == 1) return 'th';
    if(last == 1) return 'st';
    if(last == 2) return 'nd';
    if(last == 3) return 'rd';
    return 'th';
}
function convert_relative(relative){
    let days = Math.floor(relative / 86400);
    relative %= 86400;
    let hours = Math.floor(relative/3600);
    relative %= 3600;
    let minutes = Math.floor(relative/60);
    relative %= 60;
    let seconds = relative;
    let answer = []
    if(days)
        answer.push(`${days} day${days > 1 ? 's':''}`);
    if(hours)
        answer.push(`${hours} hour${hours > 1 ? 's':''}`);
    if(minutes)
        answer.push(`${minutes} minute${minutes > 1 ? 's':''}`);
    if(seconds)
        answer.push(`${seconds} second${seconds > 1 ? 's':''}`);
    return answer.join(', ');
}
const args = process.argv.slice(2);
if(!args.length) {
    console.log('Error: no arguments provided.')
    process.exit(0);
}
let month_map = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
if(args[0] == 'list') {
    get_future_contests().then(contests => {
        contests.sort((a,b) => a.startTimeSeconds - b.startTimeSeconds);
        const longest = contests.map(c => c.name.length + 3 + Math.floor(Math.log10(c.id)+1)).reduce((a,b) => Math.max(a,b));
        contests.forEach(c => {
            const name = c.name;
            const id = c.id;
            const date = new Date(c.startTimeSeconds * 1000);
            const relative = Math.abs(c.relativeTimeSeconds);
            // console.log(name.length);
            console.log(
                `${(name+` (${c.id}):`).padStart(longest+1, ' ')} Happening at ${month_map[date.getMonth()]} ${date.getDate()}${ending(date.getDate())}, ${date.getFullYear()} (${convert_relative(relative)} from now)`
            );
        });
    })
} else if(args[0] == 'schedule') {
    console.log('Coming soon.');
    process.exit(0);
} else {
    console.log('Error: invalid command.');
    process.exit(0);
}