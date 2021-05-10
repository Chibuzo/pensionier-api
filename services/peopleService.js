const { getConnection } = require('../config/dbconnection');
const { ErrorHandler } = require('../helpers/errorHandler');


const fetchPerson = async national_id => {
    if (!national_id) throw new ErrorHandler(400, 'Invalid National ID');

    const fields = [
        'PERSON_ID',
        'EFFECTIVE_START_DATE',
        'EFFECTIVE_END_DATE',
        'LAST_NAME',
        'START_DATE',
        'CURRENT_EMP_OR_APL_FLAG',
        'CURRENT_EMPLOYEE_FLAG',
        'DATE_OF_BIRTH',
        'EMAIL_ADDRESS',
        'FIRST_NAME',
        'FULL_NAME',
        'MARITAL_STATUS',
        'MIDDLE_NAMES',
        'NATIONALITY',
        'NATIONAL_IDENTIFIER',
        'REHIRE_REASON',
        'SEX',
        'TITLE',
        'ATTRIBUTE_CATEGORY',
        'ATTRIBUTE1',
        'ATTRIBUTE2',
        'DATE_OF_DEATH',
        'ORIGINAL_DATE_OF_HIRE',
        'TOWN_OF_BIRTH',
        'REGION_OF_BIRTH',
        'COUNTRY_OF_BIRTH'
    ];

    const sql = `SELECT ${fields} FROM HR.PER_ALL_PEOPLE_F WHERE NATIONAL_IDENTIFIER = :national_id`;
    const db = await getConnection();
    const result = await db.execute(sql, [national_id]);
    const person = result.rows[0];
    if (!person) throw new ErrorHandler(404, 'Person not found');

    const assignment = await fetchPersonAssignement(person.PERSON_ID);
    return { person, assignment };
};


const fetchPersonAssignement = async person_id => {
    const sql = `
        SELECT
            g.NAME grade,
            j.name job,
            ast.user_status assignment_type,
            p.name position,
            a.SUPERVISOR_ID,
            a.ASSIGNMENT_TYPE,
            a.ASSIGNMENT_NUMBER,
            a.EFFECTIVE_START_DATE,
            bg.TYPE business_group,
            pr.payroll_name,
            o.name organization,
            pg.group_name,
            l.location_code
        FROM HR.PER_ALL_ASSIGNMENTS_F a
            LEFT OUTER JOIN HR.PER_GRADES g USING(GRADE_ID)
            LEFT JOIN HR.PER_JOBS j using(job_id)
            LEFT JOIN hR.PER_ASSIGNMENT_STATUS_TYPES ast using(ASSIGNMENT_STATUS_TYPE_ID)
            LEFT JOIN hr.HR_ALL_POSITIONS_F p using (position_id)
            LEFT JOIN HR.PER_NUMBER_GENERATION_CONTROLS bg USING(BUSINESS_GROUP_ID)
            LEFT JOIN HR.PAY_ALL_PAYROLLS_F pr USING(PAYROLL_ID)
            LEFT JOIN HR.HR_ALL_ORGANIZATION_UNITS o USING(ORGANIZATION_ID)
            LEFT JOIN HR.PAY_PEOPLE_GROUPS pg USING(PEOPLE_GROUP_ID)
            LEFT JOIN HR.HR_LOCATIONS_ALL l USING(LOCATION_ID)
        WHERE a.PERSON_ID = :person_id
    `;

    const db = await getConnection();
    const result = await db.execute(sql, [person_id]);
    return result.rows[0];
};


module.exports = {
    fetchPerson
}
