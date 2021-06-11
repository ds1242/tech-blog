const { format_date, format_plural, format_url } = require('../utils/helpers');



test('format_date() returns a date string', () => {
    const date = new Date('2021-06-08 06:44:00');

    expect(format_date(date)).toBe('6/8/2021');
});



test('format_plural() returns pluralized word', () => {
    const word = 'Comment';
    const count = 2;
    
    expect(format_plural(word, count)).toBe('Comments');
});

test('format_url() returns a simplified url string', () => {
    const url1 = format_url('http://test.com/page/1');
    const url2 = format_url('https://www.coolstuff.com/abcdefg/');
    const url3 = format_url('https://www.google.com?q=hello');

    expect(url1).toBe('test.com');
    expect(url2).toBe('coolstuff.com');
    expect(url3).toBe('google.com');
});